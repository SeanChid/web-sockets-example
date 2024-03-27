import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/action'
import axios from 'axios'
import NewLobbyModal from './NewLobbyModal.jsx'

const UserPage = () => {
    const [entryCode, setEntryCode] = useState('')
    const [showLobbyModal, setLobbyModal] = useState(false)
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/')
        }
    }, [isLoggedIn, navigate])

    const handleLogout = () => {
        axios.post('/api/logoutUser')
            .then(() => {
                dispatch(logout())
                navigate('/')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const createLobby = () => {
        setLobbyModal(true)
    }

    const joinLobby = () => {
        axios.post('/api/joinLobby', {entryCode})
            .then((res) => {
                if (res.data.lobbyId === undefined) {
                    console.log('invalid lobby')
                } else {
                    navigate(`/lobby/${res.data.lobbyId}`, {state: {entryCode}})
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <h2>Welcome, {user.userName}</h2>
            <br/>
            <div className='input-group'>
                <input
                    type='text'
                    className='form-control input-group-prepend'
                    placeholder='Enter code'
                    value={entryCode}
                    onChange={(e) => setEntryCode(e.target.value)}
                />
                <button className='btn btn-primary' onClick={joinLobby}>Join Lobby</button>
            </div>
            <br/>
            <button className='btn btn-primary' onClick={createLobby}>Create Lobby</button>
            <br/>
            <br/>
            <div>
                <button className='btn btn-primary' onClick={handleLogout}>Logout</button>
            </div>

            <NewLobbyModal
                showModal={showLobbyModal}
                setShowModal={setLobbyModal}
                entryCode={entryCode}
                setEntryCode={setEntryCode}
            />
        </div>
    )
}

export default UserPage