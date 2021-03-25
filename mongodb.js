module.exports = {
  insert:insert,
  find:find
};

const DB_NAME = "admin";
const DB_USER = "root";
const DB_PASSWORD = 4150;
const DB_URL = "mongodb://"+DB_USER+":"+DB_PASSWORD+"@www-mongodb:27017/"+DB_NAME;
const MongoClient = require('mongodb').MongoClient;

function connect(callback){
  const client = new MongoClient(DB_URL);
  client.connect(function(err) {
    if(err) throw err;
    console.log("Connected to Server");

    const db = client.db(DB_NAME);
    callback(db, function(){
      client.close();
    });
  });
}

function insert(collectionName, data, callback){
  connect(function(db, close){
    const collection = db.collection(collectionName);
    collection.insertOne(data, function(err, result) {
      if (err) throw err;
      console.log("1 document inserted");

      callback(result, close);
      close(); //in case close callback isn't called above. May be allowed if no need to access database again in the above callback.
    });
  });
}

function find(collectionName, query, callback){
  connect(function(db, close){
    const collection = db.collection(collectionName);
    collection.find(query).toArray(function(err, result) {
      if (err) throw err;

      console.log("document(s) found");
      callback(result, close);
      close(); //in case close callback isn't called above. May be allowed if no need to access database again in the above callback.
    });
  });
}

//below is a template to use for express
/*app.get("/backend/mongodb/insert", function(req, res, next){
  var q = url.parse(req.url, true);
  if(q.query.collectionName && q.query.data){
    var collectionName = q.query.collectionName;
    var data = JSON.parse(q.query.data);
    mongodb.insert(collectionName, data, function(result, close){
      res.end("success");
      close();
    });
  }
  else{
    res.end("error");
  }
});

app.get("/backend/mongodb/find", function(req, res, next){
  var q = url.parse(req.url, true);
  if(q.query.collectionName && q.query.query){
    var collectionName = q.query.collectionName;
    var query = JSON.parse(q.query.query);
    mongodb.find(collectionName, query, function(result, close){
      res.end(JSON.stringify(result));
      close();
    });
  }
  else{
    res.end("error");
  }
});*/
