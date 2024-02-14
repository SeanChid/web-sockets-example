import {WebSocketServer, WebSocket} from 'ws'

const wss = new WebSocketServer({port: 8080})

const chatMessages = []

wss.on('connection', function connection(ws) {
    console.log('A new client connected')

    chatMessages.forEach(chatMessage => {
        ws.send(JSON.stringify(chatMessage))
    })

    ws.on('message', function incoming(message) {
        const data = JSON.parse(message)

        // if (data.type === 'chatMessage') {
            const chatMessage = {
                sender: data.sender,
                message: data.message,
                timestamp: new Date().toISOString()
            }

            chatMessages.push(chatMessage)

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(chatMessage))
                }
            })
        // }


    })

    ws.on('close', function close() {
        console.log('Client disconnected')
    })
})