require('dotenv').config();

const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require('http');

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

app.use(cors());
mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true });

app.use(bodyParser.json());

const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const authChannel = require("./routes/channels");

app.use('/users', usersRoute);
app.use('/auth', authRoute);
app.use('/channels', authChannel);

const Token = require('./models/Token');
const Channel = require('./models/Channel');

// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   console.log(token);
//   Token.findOne({token: token, is_active: true}, async function (err, result) {
//     if (err) throw err
//     // console.log(result, 'res')
//     if (result) {
//         console.log(socket.id);
//         await Token.findOneAndUpdate({token: token}, {socket_id: socket.id});
//         next();
//     } else {
//       next(new Error('Invalid Token'));
//     }
//   });
// });

io.on('connection', (socket) => {
  // console.log('New user connected');
  // const token = socket.handshake.auth.token;

  socket.on('join', function(channel_name) {
    socket.join(channel_name);

    // join if the channel is not private
    // Channel.findOne({channel_name: channel_name, is_public: true}, function (err, result) {
    //   if (err) throw err

    //   if (result) {
    //     socket.join(channel_name);
    //     console.log("joined")
    //   } else {
    //     socket.disconnect();
    //   }
    // });
  });

});

io.on('disconnect', async function(){
  console.log('socket disconnected');
  // console.log(socket.handshake.auth.token);
  // const token = socket.handshake.auth.token;

  // await Token.findOneAndUpdate({token: token}, {expired: true});

});

const checkCredentials = require('./middleware/checkCredentials');

app.post('/send-message/', checkCredentials, function (req, res, done) {
  data = req.body
  console.log('Got body:', req.body)
  io.to(req.body.channel_name).emit(req.body.event_name, req.body.event_json);
  res.json({message: "message sent"});

  // console.log('--------------------------------------------------------')
  // Token.findOne({user_email: req.body.email, expired: false}, async function (err, result) {
  //   if (err) throw err
  //     res.status(500);
  //     res.json({message: "error"});
  //   if (result) {
  //     console.log(result.socket_id);
  //     io.to(result.socket_id).emit(req.body.event_name, req.body.event_json);
  //     // res.json({message: "message sent"})
  //   } else {
  //     res.status(409);
  //     res.json({message: "user is not logged in"});
  //   }
  // });
})


server.listen(9060, () => {
  console.log('listening on *:9060')
});