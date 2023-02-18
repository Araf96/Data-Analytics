import path from 'path'
import express from 'express'
import colors from 'colors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import cors from 'cors'
import https from 'https'
import fs from 'fs'
// import { Server } from 'socket.io'

import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

import userRoutes from './routes/userRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import postRoutes from './routes/postRoutes.js'
import newsRoutes from './routes/newsRoutes.js'
// import generateNotification from './utils/generateNotification.js'

dotenv.config()
connectDB()
const app = express()
app.use(cors())

let key = fs.readFileSync('./ava.key')
let cert = fs.readFileSync('./ava.crt')
let options = {
    key: key,
    cert: cert
}

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
} else {
    app.use(
        morgan('combined', {
            stream: fs.createWriteStream('./blind_app.log', { flags: 'a' })
        })
    )
}

app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/news', newsRoutes)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) =>
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    )
} else {
    app.get('/', (req, res) => {
        res.send('API is running....')
    })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
// const sslServer = https.createServer(options, app)
const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
            .bold
    )
)

// const io = new Server(server)
// generateNotification(io)
