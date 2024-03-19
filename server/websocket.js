import {WebSocketServer, WebSocket} from 'ws'
import { Lobby, Message } from './db/models.js'

const wss = new WebSocketServer({port: 8080})

const clientsByLobby = new Map()

const broadcast = (lobbyId, message, excludeClient) => {
    wss.clients.forEach(client => {
        if (client !== excludeClient && clientsByLobby.get(client) === lobbyId && client.readyState === WebSocket.OPEN) {
            client.send(message)
        }
    })
}

wss.on('connection', function connection(ws) {
    console.log('A new client has joined the chat.')

    ws.on('message', async function incoming(message) {
        const data = JSON.parse(message)
        console.log(data)

        if (data.type === 'joinLobby') {
            const lobbyId = data.lobbyId

            clientsByLobby.set(ws, lobbyId)

            const joinMessage = {
                type: 'systemMessage',
                message: `${data.userName} has joined the chat.`
            }

            broadcast(lobbyId, JSON.stringify(joinMessage), ws)

            Message.findAll({where: {lobbyId: lobbyId}})
                .then(messages => {
                    messages.forEach(message => {
                        ws.send(JSON.stringify(message))
                    })
                })
                .catch(error => {
                    console.error(error)
                })
        }

        if (data.type === 'chatMessage') {
            const lobbyId = clientsByLobby.get(ws)

            if (lobbyId) {
                Message.create({
                    userId: data.userId,
                    lobbyId: data.lobbyId,
                    userName: data.userName,
                    type: 'chatMessage',
                    message: data.message,
                    timestamp: data.timestamp
                })
                .then(newMessage => {
                    wss.clients.forEach(client => {
                        if (client.readyState === WebSocket.OPEN && clientsByLobby.get(client) === lobbyId) {
                            client.send(JSON.stringify(newMessage))
                        }
                    })
                })
                .catch(error => {
                    console.error(error)
                })
            }
        }
    })

    ws.on('close', function close() {
        console.log('A client has disconnected from the chat.')

        const lobbyId = clientsByLobby.get(ws)
        if (lobbyId) {
            clientsByLobby.delete(ws)

            const leaveMessage = {
                type: 'systemMessage',
                message: 'A client has left the chat.'
            }
            broadcast(lobbyId, JSON.stringify(leaveMessage), ws)
        }

    })
})