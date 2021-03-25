//this is the server. Don't change anything here.


const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const expressWs = require('express-ws');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const url = require('url');
const fs = require('fs');
//const path = require('path');
//const cookieParser = require('cookie-parser');


const app = express();
expressWs(app);

app.set('trust proxy', 1) // trust first proxy

const mysqlCredentials = {
  "host":"mysql",
  "user":"user",
  "password":"012345",
  "database":"database"
};



app.use(session({
  secret: 'sfsdafsafasfaid8kd7', // random string
  resave: false,
  store: new MySQLStore(mysqlCredentials), //save session if server restarts
  saveUninitialized: true,
  cookie: { secure: false }
}));


app.set('view engine', 'pug');
app.set('views','./views');

app.use("/static", express.static('static'));

//Post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


const connection = mysql.createConnection(mysqlCredentials);
connection.connect(function(err){
  if(err) throw err;
});
require("./main.js")(app, connection);

app.listen(8080);
