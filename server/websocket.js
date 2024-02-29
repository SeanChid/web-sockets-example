import {WebSocketServer, WebSocket} from 'ws'
import { Message } from './db/models.js'

const wss = new WebSocketServer({port: 8080})

// const chatMessages = []

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

    // chatMessages.forEach(chatMessage => {
    //     ws.send(JSON.stringify(chatMessage))
    // })

    ws.on('message', function incoming(message) {
        const data = JSON.parse(message)

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

            // const chatMessage = {
            //     type: 'chatMessage',
            //     clientId: data.clientId,
            //     senderName: data.senderName,
            //     message: data.message,
            //     timestamp: new Date().toISOString()
            // }

            // chatMessages.push(chatMessage)

            // wss.clients.forEach(client => {
            //     if (client.readyState === WebSocket.OPEN) {
            //         client.send(JSON.stringify(chatMessage))
            //     }
            // })
        }
    })

    ws.on('close', function close() {
        console.log('A client has disconnected from the chat.')
    })
})