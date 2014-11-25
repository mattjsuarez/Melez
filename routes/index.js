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

router.get('/', function(req, res) {
  res.render('../views/index', { title: 'Express' });
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
		secondQuery(nameArray,res,requestedWeather);
	});
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
