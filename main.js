const url = require('url');
module.exports = function(app, mysqlConnection){
  //you can edit the code below this line; here are some examples




  app.get("/", function(req, res){
    var urlQuery = url.parse(req.url, true).query;
    console.log(urlQuery);
    res.render('index', { title: 'Hey', message: 'Hello there!' });
  });

  app.get("/hello-world", function(req, res){
    res.end("Hello World!");
  });

  app.get("/backend/authorize", function(req, res){
    var urlQuery = url.parse(req.url, true).query;
    mysqlConnection.query("SELECT ID, Name, Password FROM Users WHERE Name=\""+urlQuery.name+"\" AND Password=\""+urlQuery.password+"\";", function(err, results, fields){
      if (err) throw err;
      if(results[0] && results[0].Name == urlQuery.name && results[0].Password == urlQuery.password){
        req.session.authorized = true;
        req.session.userID = results[0].ID; //saves the user ID to the session
        req.session.userName = results[0].Name; // saves the Name to the session for easy access (don't have to query the databse every time it is needed)
        res.end("Authorized");
      }
      else{
        req.session.authorized = false;
        res.end("Not Authorized");
      }
    });
  });


  app.get("/backend/getUserID", function(req, res){
    if(req.session.authorized){
      res.end(""+req.session.userID);
    }
    else{
      res.end("Not Authorized");
    }
  });
  
  
  app.ws('/', function(ws, req) {
    ws.on('message-1', function(msg) {
      console.log(msg);
    });
    ws.on('message-2', function(msg) {
      console.log(msg);
    });
    console.log('socket', req.testing);
  });





//don't edit below this line
};

