import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

function Lobby() {
    
  const [ws, setWs] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [lobby, setLobby] = useState({})
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  const user = useSelector(state => state.auth.user)
  const navigate = useNavigate()

  useEffect(() => {

    if (!isLoggedIn) {
        navigate('/')
    } else {
        const newWs = new WebSocket('ws://localhost:8080')
        setWs(newWs)
        axios.get('/api/lobby?entryCode=waffle')
          .then((res) => {
            setLobby(res.data)
          })
          .catch((error) => {
            console.log(error)
          })
    
        return () => {
          newWs.close()
        }
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
      userId: user.userId,
      lobbyId: lobby.lobbyId,
      type: 'chatMessage',
      message: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    }
    ws.send(JSON.stringify(chatMessage))
    setMessageInput('')
  }

    return (
      <div>
        <h1>WebSocket Chat Room</h1>
        <div>
          {chatMessages.map((message, index) => (
            <div key={index}>{`${message.userId}: ${message.message} ${message.timestamp}`}</div>
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

export default Lobby