const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const {userJoin,getCurrentUser,getRoomUsers,userLeave} = require('./utils/users')

const app = express()

app.use(express.static('./public'))


const server = http.createServer(app)
const io = socketio(server,{
    cors: { origin: '*'}
})


io.on('connection', socket=>{
    console.log('Socket Connected')

    socket.on('joinRoom', ({name,room})=>{
        const user = userJoin(socket.id,name,room)

        socket.join(user.room)

        //Welcome message to the user connected
        socket.emit('message','Welcome to Chatzy!')

        //Broadcast when a user joins
        socket.broadcast.to(user.room).emit('message',`${name} has joined the chat`)

        //Send user and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(room)
        })
    })

    //Listen for incomming message
    socket.on('sendMessage',(msg)=>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',msg)
    })

    socket.on('disconnect', ()=>{
        console.log('Socket Disconnected')
        const user = userLeave(socket.id)
        if(user){
            //Broadcast to all when a user disconnects
            io.to(user.room).emit('message', `${user.name} has left the chat`)

            //Send updated user and room info
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    })
})

const port = process.env.PORT || 5000

server.listen(port,()=>{
    console.log("Server running on http://localhost:"+port)
})