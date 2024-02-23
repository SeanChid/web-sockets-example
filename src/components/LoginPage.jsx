import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        const user = {
            userName: username,
            userPass: password
        }

        axios.post('/api/postUser', user)
            .then((res) => {
                if (res.status === 200) {
                    navigate('/lobby')
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type='submit'>Login</button>
            </form>
        </div>
    )
}

export default LoginPage