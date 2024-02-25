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
const { loginUser, getSession } = handlerFunctions

app.post('/api/loginUser', loginUser)
app.get('/api/session', getSession)

ViteExpress.listen(app, 8000, () => console.log('server is running on 8000'))