var express = require('express');
var jade = require('jade');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//router gets id (rain/snow/wind) from url and query database based on that

//A bit of a hacky way to process AJAX calls - intercept the request URL
router.get('/updatePage/:weatherType', function(req, res) {
	//Sanitize the input
  	var dir = __dirname.split("/").slice(1,-1).join("/");
  	//Load up the directories - each file contains either the title, body text, citation or the table
  	//Yeah, this is really hacky, and I apologize, I had a real hard time getting AJAX to work properly here
  	var requestedWeather = req.param("weatherType");
  	var weatherArray = new Array(4);
  	weatherArray[0]= new Array();
  	weatherArray[1]= new Array();
  	weatherArray[2]= new Array();
	weatherArray[3]= new Array();
	//crap here
	weatherArray[0]=nameArray;
  	res.end(JSON.stringify(weatherArray));
});

module.exports = router;
