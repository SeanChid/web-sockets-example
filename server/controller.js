import bcrypt from 'bcrypt'
import { User, Lobby, Message } from './db/models.js'

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

    addUser: async (req, res) => {
        const {userName, userPass} = req.body

        const hashedPassword = await bcrypt.hash(userPass, 10)

        const newUser = await User.create({
            userName,
            userPass: hashedPassword
        })

        res.send(newUser)
    },

    getSession: (req, res) => {

        const session = req.session

        if (session && session.userId) {
            res.status(200).json({userId: session.userId})
        } else {
            res.status(404).json({message: 'Session not found'})
        }
    },

    getLobby: async (req, res) => {
        const {entryCode} = req.query

        const lobby = await Lobby.findOne({where: {entryCode: entryCode}})

        res.send(lobby)
    },

    getLobbies: async (req, res) => {
        const userId = req.session.userId

        const lobbies = await Lobby.findAll({where: {userId: userId}})

        res.send(lobbies)
    },

    addLobby: async (req, res) => {
        const {entryCode} = req.body
        const userId = req.session.userId

        const newLobby = {
            entryCode,
            userId
        }
        await Lobby.create(newLobby)
        const lobby = await Lobby.findOne({where: {entryCode: entryCode}})

        res.send(lobby)
    },

    deleteLobby: async (req, res) => {
        const {lobbyId} = req.params
        const userId = req.session.userId

        const lobby = await Lobby.findByPk(lobbyId)
        await lobby.destroy()
        const lobbies = await Lobby.findAll({where: {userId}})

        res.send(lobbies)
    },

    joinLobby: async (req, res) => {
        const {entryCode} = req.body

        const lobby = await Lobby.findOne({where: {entryCode: entryCode}})

        res.send(lobby)
    }
}

export default handlerFunctions