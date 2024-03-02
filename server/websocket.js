import {WebSocketServer, WebSocket} from 'ws'
import { Lobby, Message } from './db/models.js'

const wss = new WebSocketServer({port: 8080})

const clientsByLobby = new Map()

wss.on('connection', function connection(ws) {
    console.log('A new client has joined the chat.')

    // Message.findAll()
    //     .then(messages => {
    //         messages.forEach(message => {
    //             ws.send(JSON.stringify(message))
    //         })
    //     })
    //     .catch(error => {
    //         console.error(error)
    //     })

    ws.on('message', async function incoming(message) {
        const data = JSON.parse(message)
        console.log(data)

        if (data.type === 'joinLobby') {
            const lobbyId = data.lobbyId

            clientsByLobby.set(ws, lobbyId)

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

        clientsByLobby.delete(ws)
    })
})