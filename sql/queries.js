var Client = require('mariasql');
var inspect = require('util').inspect;
var c = new Client();

//connect to database	
c.connect({
    host: 'localhost',
    user: 'mjsuarez',
    password: 'mjsuarez_pw',
    db: 'mjsuarez_db'
});

//returns the names of all of the cities
exports.getNames = function(response) {
	var i=0;
	var nameArray = new Array(3);
	c.query("SELECT * FROM cityNames").on('result', function(res) { //generate a query to the database
   	res.on('row', function(row) {
     	console.log('Result row: ' + inspect(row));
		nameArray[i] = JSON.stringify(inspect(row));
		i++;
   	}).on('error', function(err) {
     		console.log('Result error: ' + inspect(err));
   	}).on('end', function(info) {
     		console.log('Result finished successfully');
    });}).on('end', function() {
   		console.log('Done with all results');
   		response.setHeader('Content-Type', 'application/json');
		response.write(JSON.stringify(nameArray));
		response.end();
		response.send("Test");
	});
}

//returns the amounts weather units for a particular weatherType for each of the 3 cities
exports.getAmounts = function(weather) {
	var amountQuery = c.query("SELECT * FROM cityWeather WHERE weatherType= :id",{id:weather}); //query for all of the weatherType data
	var amountArray = new Array(3); //create an array. each index will hold data for a particular city
	var i=0;		
	amountQuery.on('result',function(res) { 
	res.on('row',function(row) {
		//populate an array with relevant data
		amountArray[i] = JSON.stringify(inspect(row));
		i++;
	});
	console.log(amountArray);
});
}

//return the coordinates of each city
exports.getCoords = function() {
	var coordQuery = c.query("SELECT * FROM cityCoordinates"); //generate a query for city coordinates
	var coordArray = new Array(3); //an array to store each of the 3 cities' coordinates
	var i=0;
	coordQuery.on('result',function(res) {
			res.on('row',function(row) {
				//store the coordinates away
				coordArray[i] = JSON.stringify(inspect(row));
				i++;
		});
		console.log(coordArray);
	});
}