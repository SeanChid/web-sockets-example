import express from 'express'
import session from 'express-session'
import ViteExpress from 'vite-express'

const app = express()

app.use(session({
    secret: 'superBeans',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

import handlerFunctions from './controller.js'
const {
    loginUser,
    logoutUser,
    addUser,
    getSession,
    getLobby,
    getLobbies,
    addLobby,
    deleteLobby,
    joinLobby
} = handlerFunctions

app.post('/api/loginUser', loginUser)
app.post('/api/logoutUser', logoutUser)
app.post('/api/user', addUser)
app.get('/api/session', getSession)
app.get('/api/lobby', getLobby)
app.get('/api/lobbies', getLobbies)
app.post('/api/lobby', addLobby)
app.delete('/api/lobby/:lobbyId', deleteLobby)
app.post('/api/joinLobby', joinLobby)

ViteExpress.listen(app, 8000, () => console.log('server is running on 8000'))