var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

var BreweryDb = require('brewerydb-node');
var brewdb = new BreweryDb('');

var app = express();

var myData = [];

var callback = function (err, data) {
  if (err) {
    throw err; // Check for the error and throw if it exists.
  } else {
    console.log('got data: '+ data); // Otherwise proceed as usual.
    myData.push(data);
  }
};

//https://www.npmjs.com/package/brewerydb-node
var mySearch = brewdb.search.all( { q: "coors" }, callback);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {	 
	 console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	 next();
});

app.use(express.static("./dist"));

app.use(cors());

app.get("/brewdb-api", function (req, res)	 {
	res.json(myData);
});

app.listen(3000);

console.log("Express app running on 3000");

module.exports = app;