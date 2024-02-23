import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

function Lobby() {
    
  const [ws, setWs] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [clientId, setClientId] = useState(null)
  const [senderName, setSenderName] = useState('')
  const [validName, setValidName] = useState(false)

  useEffect(() => {
    const newClientId = uuidv4()
    setClientId(newClientId)
    
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
      clientId: clientId,
      senderName: senderName,
      message: messageInput.trim(),
      timestamp: new Date().toISOString()
    }
    ws.send(JSON.stringify(chatMessage))
    setMessageInput('')
  }

  const handleNameSubmit = () => {
    if (senderName !== '') {
      setValidName(true)
    } else {
      alert('Please input a valid name.')
    }
  }

  if (!validName) {
    return (
      <div>
        <h1>Enter a name:</h1>
        <div>
          <input
            type='text'
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
          <button onClick={handleNameSubmit}>Submit</button>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <h1>WebSocket Chat Room</h1>
        <div>
          {chatMessages.map((message, index) => (
            <div key={index}>{`${message.senderName}: ${message.message} ${message.timestamp}`}</div>
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
}

export default Lobby