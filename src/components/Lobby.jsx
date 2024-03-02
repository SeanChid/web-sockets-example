import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'

function Lobby() {
    
  const [ws, setWs] = useState(null)
  const [hasJoined, setHasJoined] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [lobby, setLobby] = useState({})
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  const user = useSelector(state => state.auth.user)
  const navigate = useNavigate()
  const location = useLocation()
  const {entryCode} = location.state

  useEffect(() => {

    if (!isLoggedIn) {
        navigate('/')
    } else {
        const newWs = new WebSocket('ws://localhost:8080')
        setWs(newWs)
        axios.get(`/api/lobby?entryCode=${entryCode}`)
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


  }, [isLoggedIn, navigate, entryCode])

  useEffect(() => {
    if (ws && ws.readyState === WebSocket.OPEN && lobby.lobbyId && !hasJoined) {
      const joinMessage = {
        type: 'joinLobby',
        lobbyId: lobby.lobbyId
      }
      ws.send(JSON.stringify(joinMessage))
      setHasJoined(true)
    }
  }, [ws, lobby, hasJoined])

  useEffect(() => {
    if (!ws) return

    ws.onmessage = function(event) {
      const message = JSON.parse(event.data)
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
      userName: user.userName,
      type: 'chatMessage',
      message: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    }
    ws.send(JSON.stringify(chatMessage))
    setMessageInput('')
  }

    return (
      <div>
        <h3>Chatroom {lobby.lobbyId}, code: {entryCode}</h3>
        <div>
          {chatMessages.map((message, index) => (
            <div key={index}>{`${message.userName}: ${message.message} ${message.timestamp}`}</div>
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
        <button onClick={() => navigate('/user')}>Leave Lobby</button>
      </div>
    )
}

export default Lobby