const express = require('express')
const app = express()
const db = require('./connection/db')
const http = require('http')
const soketio = require('socket.io')
const server = http.createServer(app)
const io  = soketio(server)
const path = require('path')
const userRouter = require ('./routes/user')
const cors = require('cors')
const dataresult = []

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public/images")));
app.use('/user', userRouter)

io.on('connection', (socket) => {
  socket.on("statusConnected", (payload) => {
    io.emit("connected", {
      onlineUSer: payload,
      status: "Connected",
    });
  });
  // console.log('user connected')
  socket.on('send-data', msg => {
    db.query(`SELECT * FROM user`, (err, resul) => {
      io.emit('ganteng', resul)
    })
  })
  socket.on('send-id', (payload) => {
    db.query(
      `SELECT friends.id, u1.image AS image, u.username AS user, u1.username AS friend, u1.id as idfriend FROM friends INNER JOIN user u ON u.id = friends.user_id INNER JOIN user u1 ON u1.id = friends.friend_id WHERE (friends.user_id = ${payload.id} AND u.id = ${payload.id})`,
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          io.to(payload.friends).emit("send-search-result", result);
        }
      }
    );
  })
     socket.on('regis', (msg) => {
       io.emit('send-regis', 'ini kembalian dari backend')
     })

     socket.on('send-message', (payload) => {
      //  const aw = [...payload, payload]
      //  console.log(payload)
      db.query(
        `INSERT INTO messsage (sender, receiver, message) VALUES ('${payload.sender}',  '${payload.receiver}', '${payload.message}')`,
        (err, result) => {
          if (err) {
            console.log(err)
          } else {
             io.to(payload.receiver).emit("asu", payload);
          }
        }
      );
     })
     
     socket.on("get-hisyory-message", payload => {
       db.query(
         `SELECT * FROM messsage WHERE (sender='${payload.sender}' AND receiver='${payload.receiver}') OR (sender='${payload.receiver}' AND receiver='${payload.sender}') `, (err,result) => {
           if(err) {
             console.log(err)
           } else {
            io.to(payload.sender).emit('send-history-message', result)
           }
         });
     });
     socket.on('join-room', (payload) => {
        // console.log( payload)
        socket.join(payload.user)
     })
     socket.on("disconnect", (data) => {
       console.log(data)
        io.emit('statusUser', data)
     });
})

server.listen(process.env.PORT, () => console.log("erver listen on port 3000"));