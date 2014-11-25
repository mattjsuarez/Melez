var Client = require('mariasql');
var express =require('express');
var inspect = require('util').inspect;
var router = express.Router();
var jade = require('jade');

var c = new Client();
c.connect({
	host: 'localhost',
    user: 'mjsuarez',
    password: 'mjsuarez_pw',
    db: 'mjsuarez_db'
});

router.get('/', function(req, res) {
  res.render('../views/dashboard', { title: 'Express' });
});

//store a name and a favorite number into the database if name is not already in database
router.get('sendFormData/:firstName,favoriteNumber', function(req, res) {
	var doQuery = c.query("SELECT * FROM favNumber WHERE firstName= :fn", {fn:firstName});
	doQuery.on('result', function(res) {
		res.on('row',function(row) {
			var obj = JSON.stringify(inspect(row));
			if(obj == "") {
				c.query("INSERT INTO favNumber VALUES (:id, :num)",{id:firstName,num:favoriteNumber});
				res.send("Input success.")
			} else {
				res.send("Name already in database.");
			}
		});
	});
});

//retrieve a favorite number from the database using first name
router.get('retrieveFavNumByFN/:firstName', function(req, res) {
	var favNum = c.query("SELECT * FROM favNumber WHERE firstName= :id", {id:firstName});
	favNum.on('result',function(res) {
		res.on('row',function(row) {
			var obj = JSON.stringify(inspect(row));
			res.send(obj);
		}
	});
});

var cityNames = c.query("SELECT * FROM cityWeather WHERE weatherType = 'snow'");
var nameArray = new Array();
var i=0;
cityNames.on('result',function(res) {
	res.on('row',function(row) {
		var objectIndex = i+1;
		nameArray[i] = JSON.stringify(inspect(row));
		//console.log(nameArray[i] + " BLAHBLAHBLAH");
		i++;
		if(i==3) {
			//console.log(nameArray);
		}
	});
});







var requestedWeather = "snow"; //req.param("weatherType");
var cityAmounts = c.query("SELECT * FROM cityWeather WHERE weatherType= :id",{id:requestedWeather}); //snow"); //
var snowArray = new Array();
var i = 0;
var chartData = c.query("SELECT * FROM cityCoordinates");
var coordArray = new Array(3);
coordArray[0] = new Array(2);
coordArray[1] = new Array(2);
coordArray[2] = new Array(2);
cityAmounts.on('result',function(res) {
	res.on('row',function(row) {
		snowArray[i] = JSON.stringify({"June":inspect(row)});
		i++;
		//console.log(snowArray);
	});
});

router.get('updateInfo/:weatherType', function(req, res) {
	var requestedWeather = req.param("weatherType");
	var cityNames = c.query("SELECT * FROM cityNames");
	var namesArray = new Array();
	var cityAmounts = c.query("SELECT * FROM cityWeather WHERE weatherType= :id",{id:requestedWeather});
	var amountsArray = new Array();
	var cityCoords = c.query("SELECT * FROM cityCoordinates");
	var coordsArray = new Array();
	var i = 0, j = 0, k = 0;
	cityNames.on('result',function(res) {
		res.on('row',function(row) {
			namesArray[i] = JSON.stringify({"Names":inspect(row)});
			i++;
		});
	});
	cityAmounts.on('result',function(res) {
		res.on('row',function(row) {
			amountsArray[j] = JSON.stringify({"Amounts":inspect(row)});
			j++;
		});
	});
	cityCoords.on('result',function(res) {
		res.on('row',function(row) {
			coordsArray[k] = JSON.stringify({"Coordinates":inspect(row)});
			k++;
		});
	});
	var allArray = new Array(3);
	allArray[0] = namesArray;
	allArray[1] = amountsArray;
	allArray[2] = coordsArray;
	res.end(JSON.stringify(allArray));
});
