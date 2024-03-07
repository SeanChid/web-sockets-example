import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPass, setConfirmPass] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (confirmPass === password) {
            const newUser = {
                userName: username,
                userPass: confirmPass
            }

            axios.post('/api/user', newUser)
                .then((res) => {
                    navigate('/')
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            console.log('Invalid input')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    placeholder='Enter a username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br/>
                <input
                    type='password'
                    placeholder='Enter a password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br/>
                <input
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                />
                <br/>
                <button type='submit'>Complete Registration</button>
            </form>
        </div>
    )
}

export default Register