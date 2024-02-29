import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { login } from '../../redux/action.js'
import axios from 'axios'

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        axios.get('/api/session')
            .then((res) => {
                if (res.status === 200) {
                    dispatch(login(res.data.user))
                    navigate('/user')
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [dispatch, navigate])

    const handleSubmit = (e) => {
        e.preventDefault()

        const user = {
            userName: username,
            userPass: password
        }

        axios.post('/api/loginUser', user)
            .then((res) => {
                if (res.status === 200) {
                    dispatch(login(res.data.user))
                    navigate('/user')
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <h1>Chatroom Experience</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br/>
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br/>
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default LoginPage