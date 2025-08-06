import express from 'express'
import http from 'http'
import cors from 'cors'
import "dotenv/config"
import mongoose from "mongoose";
import userRouter from './routes/userRoute.js';
import messageRouter from './routes/messageRoute.js';
import { Server }  from 'socket.io'

// Database Connection...
mongoose.connect(process.env.DATABASE_URL).then(()=>{
    console.log('Database Connected')
}).catch((err)=>{
    console.log(err)
})

const app = express();
const server = http.createServer(app);

// Initialize socket.io server
export const io  = new Server(server,{
    cors: {origin: '*'}
})

// Store online User
 export const userSocketMap = {};

 io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('A user connected:', userId);

  if(userId) userSocketMap[userId] = socket.id;

  //Emit online users to all connected users.
  io.emit('getOnlineUser',Object.keys(userSocketMap))

  socket.on('disconnect', ()=>{
    console.log('disconnect',userId)
    delete userSocketMap[userId];
    io.emit('getOnlineUser', userSocketMap)
  })
 })
              
app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/test',(req,res)=>{
    res.send('hello from test')

})


app.use('/api/auth',userRouter)
app.use('/api/messages',messageRouter)

server.listen(process.env.PORT,()=>{
    console.log(`server is runnig on ${process.env.PORT}...`)
})