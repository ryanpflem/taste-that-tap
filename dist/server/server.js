"use strict";

var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");

var BreweryDb = require('brewerydb-node');
var brewdb = new BreweryDb('a3bbf959e5e040fc05c170b0ddd3d205');

var myData = [];
var app = express();

//use the 'cors' middleware
app.use(cors());

//use the 'bodyParser' middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//console log req method and req url
app.use(function (req, res, next) {	 
	 console.log(`${req.method} request for '${req.url}' - ${JSON.stringify(req.body)}`);
	 next();
});

//load static files located in the 'dist' directory
app.use(express.static("./dist"));


//Polyfill
Object.entries = (object) => Object.keys(object).map(
    (key) => [ key, object[key] ]
);
//Polyfill
Object.values = (object) => Object.keys(object).map(
    (key) => object[key]
);


//callback function
function callback (err, data) {
	myData.length = 0; //empty the myData array
	console.log(myData);
  if (err) {
    throw err; // Check for the error and throw if it exists.
  } else {
    console.log('got data: ' + data); // Otherwise proceed as usual.
    myData.push(data); // Push all the objects from the response into the myData array
    sendResponse(myData);
  }
};


//https://www.npmjs.com/package/brewerydb-node
function mySearch (params) {
	console.log('mySearch params =');
	console.log(params);

	switch (params.searchType) {
		case 'searchGeoPoint':
			delete params.searchType;
			brewdb.search.geo(params, callback);
			break;
		case 'searchBrewerName':
			delete params.searchType;
			brewdb.search.all(params, callback);
			break;
		default:
			// statements_def
			break;
	}
};


//GET method route that sends JSON response to the browser
function sendResponse (myData) {
	 app.get('/brewdb-api', function (req, res) {
		res.json(myData);
		console.log('sent json data back to client');
	});
}


//POST method route to recieve input from the browser
app.post('/search-api', function (req, res) {
	console.log('post route recieved data');

	var params = req.body;
	console.log('param keys = ' + Object.keys(params));
	console.log('params =');
	console.log(params);

	mySearch(params);  //exec mySearch with params from the client
});


//listen on PORT 3000
var server = app.listen(3000);

console.log('Express server listening on port ' + server.address().port);

module.exports = app;