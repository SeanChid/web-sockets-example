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
    getSession,
    getLobby,
    addLobby
} = handlerFunctions

app.post('/api/loginUser', loginUser)
app.post('/api/logoutUser', logoutUser)
app.get('/api/session', getSession)
app.get('/api/lobby', getLobby)
app.post('/api/lobby', addLobby)

ViteExpress.listen(app, 8000, () => console.log('server is running on 8000'))