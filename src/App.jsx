import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [ws, setWs] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')

  useEffect(() => {
    const newWs = new WebSocket('ws://localhost:8080')
    setWs(newWs)

    return () => {
      newWs.close()
    }
  }, [])

  useEffect(() => {
    if (!ws) return

    ws.onmessage = function(event) {
      const message = JSON.parse(event.data)
      console.log(event.data)
      setChatMessages(prevMessages => [...prevMessages, message])
    }
  }, [ws])

  const handleMessageChange = event => {
    setMessageInput(event.target.value)
  }

  const handleMessageSend = () => {
    if (!ws || messageInput.trim() === '') return

    const chatMessage = {
      type: 'chatMessage',
      sender: 'Player',
      message: messageInput.trim(),
      timestamp: new Date().toISOString()
    }
    ws.send(JSON.stringify(chatMessage))
    setMessageInput('')
  }

  return (
    <div>
      <h1>WebSocket Chat Room</h1>
      <div>
        {chatMessages.map((message, index) => (
          <div key={index}>{`${message.sender}: ${message.message} ${message.timestamp}`}</div>
        ))}
      </div>
      <div>
        <input
          type='text'
          value={messageInput}
          onChange={handleMessageChange}
        />
        <button onClick={handleMessageSend}>Send</button>
      </div>
    </div>
  )
}

export default App
