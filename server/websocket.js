import {WebSocketServer} from 'ws'

const wss = new WebSocketServer({port: 8080})

wss.on('connection', function connection(ws) {
    console.log('A new client connected')

    ws.on('message', function incoming(message) {
        console.log('received: %s', message)

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === client.OPEN) {
                client.send(message)
            }
        })
    })

    ws.on('close', function close() {
        console.log('Client disconnected')
    })
})