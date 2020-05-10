const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {

    console.log('New websocket connection')
    //emit to that connection
    socket.emit('message', generateMessage('Welcome !'))

    //send everybody except socket
    socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    socket.on('sendMessage', (msg, callback) => {
        //send to everyone
        io.emit('message', generateMessage(msg))
        callback('Delivered!')
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    //send event when client disconnect
    socket.on('disconnect', () => {
        //send to everyone because the client is disconnected
        io.emit('message', generateMessage('A user has left'))
    })
})

server.listen(port, () => {
    console.log(`Server is up and running on port ${port}, check the application in the browser`)
})