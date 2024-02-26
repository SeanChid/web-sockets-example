import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/action'
import axios from 'axios'

const UserPage = () => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/')
        }
    }, [isLoggedIn])

    const handleLogout = () => {
        axios.post('/api/logoutUser')
            .then(() => {
                console.log(isLoggedIn)
                dispatch(logout())
                console.log(isLoggedIn)
                navigate('/')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <h1>User Page</h1>
            <br/>
            <button onClick={() => navigate('/lobby')}>Join Lobby</button>
            <br/>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default UserPage