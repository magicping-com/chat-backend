require('dotenv').config();
const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require('passport')
const nunjucks = require('nunjucks')
const session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);
const { instrument } = require("@socket.io/admin-ui");
const { createServer } = require('http');

const app = express();
const server = createServer(app);
const checkCredentials = require('./middleware/checkCredentials');
const isLoggedIn = require('./middleware/isLoggedIn');

require('./config/passport-setup')
// const isLconst isLoggedIn = require('./config/middleware')

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
    // credentials: true
  }
})

instrument(io, {
  auth: false
});

app.use(cors());
mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true, useNewUrlParser: true });

app.use(bodyParser.json());

nunjucks.configure('views', {
  autoescape: true,
  express: app
});

// view engine setup
app.set('views', 'views')
// app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'))

var store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: 'authSessions'
});

// Catch errors
store.on('error', function (error) {
  console.log(error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    },
    store: store,
    resave: true,
    saveUninitialized: true
  })
)


app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())
app.use(passport.session())

// app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const Token = require('./models/Token');
const { Channel } = require('./models/Channel');
const { Socket } = require('./models/Socket');

const apiRoute = require("./routes/api");
const usersRoute = require("./routes/users");
const authRouter = require("./routes/auth");
const authChannel = require("./routes/channels");
const userAppRouter = require("./routes/app");

app.use('/api', checkCredentials, apiRoute);
app.use('/users', checkCredentials, usersRoute);
// app.use('/auth', authRoute);
app.use('/channels', checkCredentials, authChannel);

app.use('/auth', authRouter)
app.use('/app', isLoggedIn, userAppRouter)


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

  socket.on('join', function (channel_name) {

    Channel.findOne({ name: channel_name }, function (err, result) {

      if (err) throw err

      if (result) {
        if (result.is_public == true) {
          socket.join(channel_name);
          // console.log("joined public channel")
        }
        else {

          // 1. get socket id.
          // 2. check the socket id in the users sockets.
          // 3. get token if available.
          // 4. exit if token is not available for the socket.
          // 5. check if the user is added to the channel or not to join.

          Socket.findOne({ channel: result, socket_id: socket.id }, async function (err, result) {
            if (err) throw err

            if (result) {
              result.connected = true;
              await result.save();
              socket.join(channel_name);
              // console.log("joined private channel")
            }
          });
        }
      } else {
        socket.disconnect();
      }
    });
  });
});

io.on('disconnect', async function () {
  console.log('socket disconnected');
});

io.of("/").adapter.on("join-room", async (room, id) => {
  console.log(`socket ${id} has joined room ${room}`);
  if (room.split("-")[0] == "presence") {

    // need to emit status to the room
    sockets = await Socket.find({ channel_name: room, connected: true }, { _id: 0, user_id: 1, user_info: 1 });
    // io.to(room).emit("member_joined", docs)
    // });

    io.to(room).emit("member_joined", sockets)

  }
});

io.of("/").adapter.on("leave-room", (room, id) => {
  console.log(`socket ${id} has left room ${room}`);

  if (room.split("-")[0] == "presence") {
    Socket.findOne({ channel_name: room, socket_id: id }, async function (err, result) {
      if (err) throw err

      if (result) {
        result.connected = false;
        await result.save();
        // console.log("joined private channel")
        io.to(room).emit("member_left", sockets)

      }
    });
  }
});

app.get('/', function (req, res) {
  res.render('login.html')
})

app.get('/demo', function (req, res) {
  res.render('demo.html')
})

app.post('/send-message/', checkCredentials, function (req, res, done) {
  data = req.body
  console.log('Got body:', req.body)
  // send message if channel is created already
  Channel.findOne({ name: data.channel_name }, async function (err, result) {
    if (err) throw err

    if (result) {
      io.to(data.channel_name).emit(data.event_name, data.event_json);
      res.json({ message: "message sent" });
    } else {
      res.status(404);
      res.json({ message: "invalid channel" });
    }
  });
})


server.listen(9060, () => {
  console.log('listening on *:9060')
});
