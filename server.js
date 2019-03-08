'use strict';

var express = require('express');
var mongo = require('mongodb');
try{
  var mongoose = require('mongoose');
} catch (e) {
  console.log(e);
}

var cors = require('cors');
var dns = require('dns');
var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser:true});
var schema = new mongoose.Schema({
  url : {
    type: String,
    required: true
  },
  code: Number
});
var Shortlink = mongoose.model('Shortlink', schema);



app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
var bodyParser=require('body-parser');

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});


app.use("/api/shorturl/new", bodyParser.urlencoded({extended:false}));
  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.use("/", (req, res, next)=>{
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
});
app.use("/", express.static(__dirname + "/public"));

let numberOfEntries;

var updateCount = function(done){
    Shortlink.find().estimatedDocumentCount((error, count)=>{
      if(error) return console.log(error);
      numberOfEntries = count;
      done();
    });
};

app.route("/api/shorturl/new").get((req, res)=>{
  res.json({"hi": req.query});
}).post((req, res)=>{
  dns.lookup(req.body.url, (err, add, fam)=>{
    if(err){
      res.json({"error":"Invalid URL"});
    }else{
      updateCount(()=>{
        let document = new Shortlink({
        url: req.body.url,
        code: numberOfEntries+1
      });
      document.save((err, data)=>{
        if(err) return "ERRR";
      })
        res.json({"original_url": req.body.url, "short_url":+numberOfEntries+1});
      });
    } 
  });
});

var findSite = function(codeNumber, done){
  Shortlink.findOne({code: codeNumber}, (err, data)=>{
    if(err) console.log("ERROROROROROROR");
    done(err, data);
  });
}

app.get("/api/shorturl/:code", (req, res)=>{
  console.log("received " + req.params.code);
  findSite(req.params.code, (err, data)=>{
    if(err) return err;
    res.redirect(data.url);
  })
  
});

/*
I can POST a URL to
  [project_url]/api/shorturl/new and I will receive
  a shortened URL in the JSON response. Example :
  {"original_url":"www.google.com",
  "short_url":1}
If I pass an invalid URL that doesn't follow the
  valid http(s)://www.example.com(/more/routes)
  format, the JSON response will contain an error
  like {"error":"invalid URL"}. HINT: to be sure
  that the submitted url points to a valid site you
  can use the function dns.lookup(host, cb) from the
  dns core module.
When I visit the shortened URL, it will redirect me
  to my original link.
*/


app.listen(port, function () {
  console.log('Node.js listening ...');
});