import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/action'
import axios from 'axios'

const UserPage = () => {
    const [entryCode, setEntryCode] = useState('')
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
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
        // const generatedCode = Math.floor(1000 + Math.random() * 9000).toString()

        const newLobby = {
            entryCode: entryCode
        }

        axios.post('/api/lobby', newLobby)
            .then((res) => {
                navigate(`/lobby/${res.data.lobbyId}`, {state: {entryCode}})
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const joinLobby = () => {
        axios.post('/api/joinLobby', {entryCode})
            .then((res) => {
                navigate(`/lobby/${res.data.lobbyId}`, {state: {entryCode}})
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <h1>User Page</h1>
            <br/>
            <input
                type='text'
                placeholder='Enter Entry Code'
                value={entryCode}
                onChange={(e) => setEntryCode(e.target.value)}
            />
            <button onClick={joinLobby}>Join Lobby</button>
            <br/>
            <button onClick={createLobby}>Create Lobby</button>
            <br/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default UserPage