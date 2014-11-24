var Client = require('mariasql');
var inspect = require('util').inspect;
c.connect({
	host: 'localhost',
    user: 'mjsuarez',
    password: 'mjsuarez_pw',
    db: 'mjsuarez_db'
});
var cityNames = c.query("SELECT * FROM cityNames");
cityNames.on('result',function(res) {
	res.on('row',function(row) {
		console.log("Row: "+inspect(row.CityName));
		console.log(typeof(inspect(row.CityName)));
	});
});
var cityAmounts = c.query("SELECT * FROM cityWeather");
var chartData = c.query("SELECT * FROM cityCoordinates");
chartData.on('result',function(res) {
	res.on('row',function(row) {
		console.log("X coord: "+inspect(row.cityXCoordinate));
		console.log("Y coord: "+inspect(row.cityYCoordinate));
	});
});