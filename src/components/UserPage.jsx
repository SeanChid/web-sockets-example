import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const UserPage = () => {
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/')
        }
    }, [])

    return (
        <div>
            <h1>User Page</h1>
        </div>
    )
}

export default UserPage