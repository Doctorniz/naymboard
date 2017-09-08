//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//

var http = require('http');
var path = require('path');
const cookieParser = require('cookie-parser');
var express = require('express');
var socketio = require('socket.io');
var app = express();
const mongoose = require('mongoose');
const Users = require('./app/models/Users')


var routes = require('./app/routes/index');
//var routes =require('./client/js/routes');
var React = require('react');
var Router = require('react-router')


const bodyParser = require('body-parser');
var cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
 



require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE, (err,db) => {
  if (err) return console.log("error: " + err);
  else console.log("MongoDB connected at " + new Date())
});

app.set('views', path.join(__dirname, 'app/views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug');
//app.set('view engine', 'jsx');
//app.engine('jsx', require('express-react-views').createEngine());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

  
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


passport.use('local', new LocalStrategy(
  function(username, password, done) {
    Users.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, {message: "No such user"}); }
      user.verifyPassword(password, function(err, isMatch) {
            if (err) throw err;
            if(!isMatch) return done(null,false, {message: "Not the correct password"})
            if(isMatch) return done(null, user);
        }) 
      
    });
  }
));

passport.use('twitter', new TwitterStrategy({
  consumerKey: process.env.TWITTERAPIKEY,
  consumerSecret: process.env.TWITTERAPISECRET,
  callbackURL: process.env.TWITTERCB
  }, function(token, tokenSecret, profile, done) {
    process.nextTick(() => {
      Users.findOne({username:"@" + profile.username}, (err, user) => {
        if(err) return done(err);
        if(user) {
          return done(null, user);
        } else {
          var newUser = new Users();
          newUser.username = "@"+profile.username
          newUser.password = token;
          newUser.save((err) => {
            if(err) throw err;
            return done(null, newUser);
          })
        }
    
      })
    })
  }
  ))

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  Users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});
app.use(cors());
app.use('/client', express.static(path.resolve(__dirname, 'client')));
app.use('/upl', express.static(path.resolve(__dirname, 'app/uploads')));


//app.get('/a', (req, res) => res.render('index'));

app.use('/', routes)

//app.use('/', routes);


const server = app.listen(process.env.PORT || 5000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

var io = socketio.listen(server);

var connections = [];


io.on('connection', function (socket) {
    connections.push(socket);
    socket.emit('connected', "Connected");
    console.log(connections.length + " connected following connect");
    
    socket.on('disconnect', (data) => {
      connections.splice(connections.indexOf(socket), 1)
      console.log(connections.length + " connected following disconnect")
    });
    
    
  });




