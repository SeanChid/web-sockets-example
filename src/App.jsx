import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState(null)
  const [message, setMessage] = useState('')
  const [receivedMessage, setReceivedMessage] = useState('')

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080')

    ws.onopen = () => {
      console.log('Connected to server')
      setSocket(ws)
    }

    ws.onmessage = (event) => {
      event.data.text().then((text) => {
        setReceivedMessage(text)
      })
    }

    ws.onclose = () => {
      console.log('Disconnected from server')
    }

    return () => {
      ws.close()
    }
  }, [])

  const sendMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(message)
      setMessage('')
    } else {
      console.log('Socket not connected')
    }
  }

  return (
    <div className='App'>
      <h1>WebSocket Example</h1>
      <div>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h2>Received Message:</h2>
        <p>{receivedMessage}</p>
      </div>
    </div>
  )
}

export default App
