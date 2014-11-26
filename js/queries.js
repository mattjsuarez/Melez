var Client = require('mariasql');
var express =require('express');
var inspect = require('util').inspect;
var router = express.Router();
var jade = require('jade');

//create a client to connect to the database
var c = new Client();
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
	var doQuery = c.query("SELECT * FROM favNumber WHERE firstName= :fn", {fn:firstName}); //checks database to see if a name is entered into it
	doQuery.on('result', function(res) {
		res.on('row',function(row) {
			var obj = JSON.stringify(inspect(row)); //stringify result
			if(obj == "") { //if the database does NOT contain this name...
				c.query("INSERT INTO favNumber VALUES (:id, :num)",{id:firstName,num:favoriteNumber}); //insert it into the database along with the favorite number
				res.send("Input success.")
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
		}
	});
});

//this function returns an array(3)(14) of weather data
router.get('updateInfo/:weatherType', function(req, res) {
	var requestedWeather = req.param("weatherType"); //return the value of the parameter
	var cityNames = c.query("SELECT * FROM cityNames"); //generate query for the cityNames table
	var namesArray = new Array();
	var cityAmounts = c.query("SELECT * FROM cityWeather WHERE weatherType= :id",{id:requestedWeather}); //generates query for data from cityWeather table for entrys of weatherType requestedWeather
	var amountsArray = new Array();
	var cityCoords = c.query("SELECT * FROM cityCoordinates"); //generate query for cityCoordinates table
	var coordsArray = new Array();
	var i = 0, j = 0, k = 0;
	cityNames.on('result',function(res) {
		res.on('row',function(row) {
			//populates array with names of cities
			namesArray[i] = JSON.stringify({"Names":inspect(row)});
			i++;
		});
	});
	cityAmounts.on('result',function(res) {
		res.on('row',function(row) {
			//populates array with weatherData of each of 3 cities
			amountsArray[j] = JSON.stringify({"Amounts":inspect(row)});
			j++;
		});
	});
	cityCoords.on('result',function(res) {
		res.on('row',function(row) {
			//populates array with coordinates of each of 3 cities
			coordsArray[k] = JSON.stringify({"Coordinates":inspect(row)});
			k++;
		});
	});
	var allArray = new Array(3);
	allArray[0] = namesArray;
	allArray[1] = amountsArray;
	allArray[2] = coordsArray;
	res.end(JSON.stringify(allArray)); //return an array of arrays
});
