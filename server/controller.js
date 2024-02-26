import bcrypt from 'bcrypt'
import { User, Message } from './db/models.js'

const handlerFunctions = {

    loginUser: async (req, res) => {
        const {userName, userPass} = req.body

        const user = await User.findOne({where: {userName: userName}})

        if (user) {
            bcrypt.compare(userPass, user.userPass, (err, result) => {
                if (err) {
                    console.error('Error comparing passwords:', err)
                    res.status(500).json({message: 'Internal server error'})
                }
                if (result) {
                    req.session.userId = user.userId
                    res.status(200).json({user})
                } else {
                    res.status(401).json({message: 'Invalid credentials'})
                }
            })
        } else {
            res.status(404).json({message: 'Invalid credentials'})
        }
    },

    logoutUser: (req, res) => {
        req.session.destroy((error) => {
            if (error) {
                console.error(error)
                return res.status(500).json({message: 'Internal server error'})
            }
        })
        return res.status(200).json({message: 'Logout successful'})
    },

    getSession: (req, res) => {

        const session = req.session

        if (session && session.userId) {
            res.status(200).json({userId: session.userId})
        } else {
            res.status(404).json({message: 'Session not found'})
        }
    }
}

export default handlerFunctions