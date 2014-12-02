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

//renders dashboard.jade in the ../views/ directory
router.get('/', function(req, res) {
  res.render('../views/dashboard', { title: 'Express' });
});


//store a name and a favorite number into the database if name is not already in database
router.get('sendFormData/:firstName/:favoriteNumber', function(req, res) {
	var fName = req.param("firstName");
	var fNumber = req.param("favoriteNumber");
	var doQuery = c.query("SELECT * FROM favNumber WHERE firstName= :fn", {fn:fName}); //checks database to see if a name is entered into it
	doQuery.on('result', function(res) {
		res.on('row',function(row) {
			var obj = JSON.stringify(inspect(row)); //stringify result
			if(obj == "") { //if the database does NOT contain this name...
				c.query("INSERT INTO favNumber VALUES (:id, :num)",{id:fName,num:fNumber}); //insert it into the database along with the favorite number
				res.send("Input success.");
			} else {
				res.send("Name already in database."); //otherwise, declare that the name was already in the database
			}
		});
	});
});

//retrieve a favorite number from the database using first name
router.get('retrieveFavNumByFN/:firstName', function(req, res) {
	var favNum = c.query("SELECT * FROM favNumber WHERE firstName= :id", {id:firstName}); //if only a name was submitted, then retrieve the favorite number of the name
	favNum.on('result',function(res) {
		res.on('row',function(row) {
			var obj = JSON.stringify(inspect(row));
			res.send(obj); //...and send the name and number back
});});});

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
