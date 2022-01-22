const path = require("path")
const express = require("express");
const http = require("http");
const socketio = require("socket.io")
const Filter = require("bad-words")
const{genrateMessage,genrateLocationMessage} = require("./utils/message")
const {addUser,removeUser,getUser,getUsersInRoom} = require("./utils/users")

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT||3000;

const publicDirectory = path.join(__dirname,'../public')
app.use(express.static(publicDirectory))
// let count = 0
io.on('connection',(socket)=>{
    console.log("new websocket connection")
   socket.on("join",({username,room},callback)=>{

    const {error,user} = addUser({id:socket.id,username,room})
    if(error){
       return callback(error)

    }
       socket.join(user.room)
       socket.emit("data",genrateMessage("Admin","welcome"))
       socket.broadcast.to(user.room).emit("data",genrateMessage("Admin",`${user.username} has joined!`))
      io.to(user.room).emit("roomData",{
          room:user.room,
          users:getUsersInRoom(user.room)
      })

       callback()

   })
    socket.on("messageData",(data,callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter();
        if(filter.isProfane(data)){
            return callback("profanity was not allowed") 
        }
       io.to(user.room).emit("data",genrateMessage(user.username,data))
       callback()
    })

    socket.on("sendLocation",(data,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit("locationMessage",genrateLocationMessage(user.username,`https://google.com/maps?q=${data.lat},${data.lang}`))
        callback()
    })

    socket.on('disconnect',()=>{

        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit("data",genrateMessage("Admin",`${user.username} has left!`))
            io.to(user.room).emit("roomData",{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        
    })
})
server.listen(port,()=>{
    console.log(`app is running on ${port}`) 
})