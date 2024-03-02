import {WebSocketServer, WebSocket} from 'ws'
import { Lobby, Message } from './db/models.js'

const wss = new WebSocketServer({port: 8080})

const lobbyChannels = new Map()

wss.on('connection', function connection(ws) {
    console.log('A new client has joined the chat.')

    Message.findAll()
        .then(messages => {
            messages.forEach(message => {
                ws.send(JSON.stringify(message))
            })
        })
        .catch(error => {
            console.error(error)
        })

    ws.on('message', async function incoming(message) {
        const data = JSON.parse(message)

        if (data.type === 'joinLobby') {
            const lobbyId = data.lobbyId
            const lobby = await Lobby.findByPk(lobbyId)
            if (lobby) {
                if (!lobbyChannels.has(lobbyId)) {
                    lobbyChannels.set(lobbyId, new Set())
                }
                lobbyChannels.get(lobbyId).add(ws)
            }
        }

        if (data.type === 'createLobby') {
            const newLobby = await Lobby.create()
        }

        if (data.type === 'chatMessage') {

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
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(newMessage))
                    }
                })
            })
            .catch(error => {
                console.error(error)
            })
        }
    })

    ws.on('close', function close() {
        console.log('A client has disconnected from the chat.')
    })
})