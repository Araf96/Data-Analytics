import asyncHandler from 'express-async-handler'
import Notification from '../models/notificationModel.js'

const generateNotification = asyncHandler(async (io) => {
    const salesmanChannel = io.of('/salesman')
    const adminChannel = io.of('/admin')

    salesmanChannel.on('connection', async (socket) => {
        console.log('a user connected to salesman channel ', socket.id)
        socket.on('disconnect', () => {
            console.log('a user disconnected to salesman channel: ', socket.id)
        })
        socket.on('send-notification', async (data) => {
            const notification = await Notification.create({
                content: data.content,
                user: data.userInfo._id,
                type: data.type
            })
            if (notification) {
                adminChannel.emit('new-notification', data)
            }

            // if (notification) {
            //     res.status(201).json(notification)
            // } else {
            //     res.status(400)
            //     throw new Error('Invalid notification data')
            // }
        })
    })

    adminChannel.on('connection', async (socket) => {
        console.log('a user connected to admin channel ', socket.id)
        socket.on('disconnect', () => {
            console.log('a user disconnected from admin channel: ', socket.id)
        })
        socket.on('send-notification', async (data) => {
            console.log(socket.id, data.msg)
            const notification = await Notification.create({
                content: data.content,
                user: data.userInfo._id,
                type: data.type
            })
            if (notification) {
                salesmanChannel.emit('new-notification', data)
            }
        })
    })
})

export default generateNotification
