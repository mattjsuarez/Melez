var express = require('express');
var jade = require('jade');
var router = express.Router();

var Client = require('mariasql');
var inspect = require('util').inspect;
var c = new Client();

	
c.connect({
    host: 'localhost',
    user: 'mjsuarez',
    password: 'mjsuarez_pw',
    db: 'mjsuarez_db'
});
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/updatePage/:weatherType', function(req, res) {
	var requestedWeather = req.param("weatherType");
	var i=0;
	var nameArray = new Array(3);
	c.query("SELECT * FROM cityNames").on('result', function(res) {
   	res.on('row', function(row) {
		nameArray[i] = JSON.stringify(inspect(row));
		i++;
   	}).on('error', function(err) {
     		console.log('Result error: ' + inspect(err));
   	}).on('end', function(info) {
     		console.log('Result finished successfully');
    });}).on('end', function() {
		//res.send(nameArray);
		secondQuery(nameArray,res,requestedWeather);
	});
	//SQL.getNames(res);
	//console.log(testingArray);
	//var cityAmounts = SQL.getAmounts(requestedWeather);
	//var cityCoords = SQL.getCoords();

	/*var cityAmounts = c.query("SELECT * FROM cityWeather WHERE weatherType= :id",{id:requestedWeather});
	var amountsArray = new Array();
	var cityCoords = c.query("SELECT * FROM cityCoordinates");
	var coordsArray = new Array();
	var i = 0, j = 0, k = 0;

	cityCoords.on('result',function(res) {
		res.on('row',function(row) {
			coordsArray[k] = JSON.stringify({"Coordinates":inspect(row)});
			k++;
			if(k==0) {
				allArray[k] = namesArray;
			} else if (k==1) {
				allArray[k] = amountsArray;
			} else if (k==2) {
				allArray[k] = coordsArray;
				//res.end(JSON.stringify(allArray));
			}
		});
	console.log(allArray);	
	});*/
});
function secondQuery(nameArray,res,weather) {
	var amountArray = new Array(3);
	var finalArray = new Array(2);
	var j=0;
	c.query("SELECT * FROM cityWeather WHERE weatherType=:id",{id:weather}).on('result', function(res) {
	   	res.on('row', function(row) {
			amountArray[j] = JSON.stringify(inspect(row));
			j++;
	   	}).on('error', function(err) {
	     		console.log('Result error: ' + inspect(err));
	   	}).on('end', function(info) {
	     		console.log('Result finished successfully');
	    });}).on('end', function() {
			finalArray[0] = nameArray;
			finalArray[1] = amountArray;
			res.send(finalArray);
		});	
}
module.exports = router;
