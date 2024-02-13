import express from 'express'
import ViteExpress from 'vite-express'

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

ViteExpress.listen(app, 8000, () => console.log('server is running on 8000'))