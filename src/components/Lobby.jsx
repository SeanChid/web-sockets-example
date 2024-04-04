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
        return
    }

    const newWs = new WebSocket('ws://192.168.0.50:8080')
    setWs(newWs)

    newWs.onopen = () => {
      axios.get(`/api/lobby?entryCode=${entryCode}`)
        .then((res) => {
            setLobby(res.data)
            if (newWs.readyState === WebSocket.OPEN) {
              const joinMessage = {
                type: 'joinLobby',
                lobbyId: res.data.lobbyId,
                userName: user.userName
              }
              newWs.send(JSON.stringify(joinMessage))
              setHasJoined(true)
            }
        })
        .catch((error) => {
          console.log(error)
        })
    }
    return () => {
      newWs.close()
    }
  }, [isLoggedIn, navigate, entryCode])

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
        <h3>Chatroom: {entryCode}</h3>
        <div style={{textAlign: 'left', maxWidth: '400px', overflow: 'auto'}}>
          {chatMessages.map((message, index) => (
                <div key={index}>
                  {message.type === 'systemMessage' ? (
                    <span style={{ fontStyle: 'italic' }}>{message.message}</span>
                  ) : (
                    <span>
                      <strong>{`${message.userName}: `}</strong> {`${message.message}`} <span style={{fontWeight: 300}}>{`${message.timestamp}`}</span>
                    </span>
                  )}
                </div>
              )
          )}
        </div>
        <div className='input-group'>
          <input
            type='text'
            className='form-control'
            placeholder='Enter message'
            value={messageInput}
            onChange={handleMessageChange}
          />
          <button className='btn btn-success' onClick={handleMessageSend}>Send</button>
        </div>
        <br/>
        <button className='btn btn-primary' onClick={() => navigate('/user')}>Leave Lobby</button>
      </div>
    )
}

export default Lobby