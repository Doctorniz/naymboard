npm init

nvm install node 8
nvm default 8


npm i socket.io@1 -S
npm i express@4 -S


 sudo apt-get update; sudo apt-get install heroku-toolbelt heroku
 
 *add folders app > controllers, models, routes, views, jsx

 
 git init
 
 git add *
 git commit -m "message"
 
npm i mongoose -S
npm i cookie-parser -S
npm i body-parser -S
npm i express-session -S
 npm i dotenv -S
 
 
*new variables.env

DATABASE=mongodb://user:naymcard@ds054479.mlab.com:54479/fccprojects
SECRET=secret
KEY=key

*simplify server.js

///////////////////////////START OF SERVER.JS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

var http = require('http');
var path = require('path');
const cookieParser = require('cookie-parser');
var express = require('express');
var socketio = require('socket.io');
var app = express();
var router = require('./app/routes/index');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var cors = require('cors');
const session = require('express-session');

require('dotenv').config({ path: 'variables.env' });


mongoose.connect(process.env.DATABASE, (err,db) => {
  if (err) return console.log("error: " + err);
  else console.log("MongoDB connected")
});

app.set('views', path.join(__dirname, 'app/views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

  
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie:{
        httpOnly:false,
        expires:false
    }
}));

app.use(bodyParser.json())
app.use(cors());


app.use(express.static(path.resolve(__dirname, 'client')));


app.use('/', router)


const server = app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});

var io = socketio.listen(server);

var connections = [];


io.on('connection', function (socket) {
    connections.push(socket);
    socket.emit('connected', socket);
    console.log(connections.length + " connected following connect");
    
    socket.on('disconnect', (data) => {
      connections.splice(connections.indexOf(socket), 1)
      console.log(connections.length + " connected following disconnect")
    });
    
    
  });
  
  
  ///////////////////////////END OF SERVER.JS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

npm i webpack@3 -g
npm i nodemon -g
npm i concurrently -g
npm i babel-loader babel-core babel-preset-es2015 babel-preset-react -S




*create webpack.config.js


module.exports = {
    entry: {
       page1:  "./app/jsx/page1.jsx"}
        ,
    output: {
        path: __dirname + '/client/js',
        filename: "[name].js"
    },
    module: {
        loaders: [
            { test: /.jsx?$/, loader: "babel-loader", exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }}
        ]
    }
};


*create page1.jsx


*change package.json - "start" : "concurrently 'nodemon' 'webpack --watch' "

*create routes/index.js

var express = require('express');
var router = express.Router();

var siteController = require("../controllers/siteController");

router.get('/a', siteController.home);


module.exports = router;

*create controllers/siteController.js

exports.home = (req, res) => {
    res.render("index", {
        
    })
}

*create css/site.css

*create layout.pug

html
  head
    title= "pseudoNaym "
    link(href="https://fonts.googleapis.com/css?family=Amatic+SC|Baloo|Exo|Josefin+Sans|Nova+Mono|Pacifico|Rock+Salt" rel="stylesheet")
    style
      include ../../client/css/site.css
    block css
    block jshead
  body
    block header
      a(href='/').siteTitle
        .siteTitle= ""
      .sitenav
      if loggedIn
        .userLoggedInDash
      if !loggedIn
        .NotLoggedIn
      .miniDash
        block miniDash
      
    
    
    .content
      block content
    
    
    .footer
      block footer
        .Footer
          span &copy2017 Nizar Ahmed
    block jsfoot


npm i react -S
npm i react-dom -S
