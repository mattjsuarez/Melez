var Client = require('mariasql');
var inspect = require('util').inspect;
var c = new Client();

	
c.connect({
    host: 'localhost',
    user: 'mjsuarez',
    password: 'mjsuarez_pw',
    db: 'mjsuarez_db'
});

exports.getNames = function(response) {
	var i=0;
	var nameArray = new Array(3);
	c.query("SELECT * FROM cityNames").on('result', function(res) {
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
exports.getAmounts = function(weather) {
	var amountQuery = c.query("SELECT * FROM cityWeather WHERE weatherType= :id",{id:weather});
	var amountArray = new Array(3);
	var i=0;		
	amountQuery.on('result',function(res) {
	res.on('row',function(row) {
		amountArray[i] = JSON.stringify(inspect(row));
		i++;
	});
	console.log(amountArray);
});
}
exports.getCoords = function() {
	var coordQuery = c.query("SELECT * FROM cityCoordinates");
	var coordArray = new Array(3);
	var i=0;
	coordQuery.on('result',function(res) {
			res.on('row',function(row) {
				coordArray[i] = JSON.stringify(inspect(row));
				i++;
		});
		console.log(coordArray);
	});
}