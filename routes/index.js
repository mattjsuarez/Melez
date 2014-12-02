var express = require('express');
var jade = require('jade');
var router = express.Router();
var Client = require('mariasql');
var inspect = require('util').inspect;
var c = new Client();

//connect to the database
c.connect({
    host: 'localhost',
    user: 'mjsuarez',
    password: 'mjsuarez_pw',
    db: 'mjsuarez_db'
});

//connect to dashboard.jade file to render it
router.get('/', function(req, res) {
  res.render('../views/dashboard', { title: 'Express' });
});

//a function to return an array(3) of information that will be used to generate charts
router.get('/updatePage/:weatherType', function(req, res) {
	var requestedWeather = req.param("weatherType"); //retrieve the value from the variable weatherType
	var i=0;
	var nameArray = new Array(3); //create the array(3) that will be returned that will contain names of cities
	c.query("SELECT * FROM cityNames").on('result', function(res) { //generate a query
   	res.on('row', function(row) {
   		//populate the array by breaking up the query into rows
		nameArray[i] = JSON.stringify(inspect(row));
		i++;
   	}).on('error', function(err) {
     		console.log('Result error: ' + inspect(err));
   	}).on('end', function(info) {
     		console.log('Result finished successfully');
    });}).on('end', function() {
		secondQuery(nameArray,res,requestedWeather); //call secondary function to return the array
	});
});
function secondQuery(nameArray,res,weather) {
	var amountArray = new Array(3);
	var finalArray = new Array(2); //this array will contain 2 arrays: 1 array containing city names, 1 array containing weather data for 3 cities
	var j=0;
	c.query("SELECT * FROM cityWeather WHERE weatherType=:id",{id:weather}).on('result', function(res) { //generate a query that will contain data for a weatherType
	   	res.on('row', function(row) {
	   		//populate array with weather data
			amountArray[j] = JSON.stringify(inspect(row));
			j++;
	   	}).on('error', function(err) {
	     		console.log('Result error: ' + inspect(err));
	   	}).on('end', function(info) {
	     		console.log('Result finished successfully');
	    });}).on('end', function() {
			//populate array to be returned with other arrays
			finalArray[0] = nameArray;
			finalArray[1] = amountArray;
			res.send(finalArray); //send both arrays
		});	
}
module.exports = router;
