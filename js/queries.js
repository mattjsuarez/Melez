var Client = require('mariasql');
var inspect = require('util').inspect;

var c = new Client();
c.connect({
	host: 'localhost',
    user: 'mjsuarez',
    password: 'mjsuarez_pw',
    db: 'mjsuarez_db'
});
var cityNames = c.query("SELECT * FROM cityNames");
var nameArray = new Array();
var i=0;
cityNames.on('result',function(res) {
	res.on('row',function(row) {
		var objectIndex = i+1;
		nameArray[i] = JSON.stringify({"Name":inspect(row.CityName)});
		i++;
		if(i==3) {
			console.log(nameArray);
		}
	});
});
var cityAmounts = c.query("SELECT * FROM cityWeather");
var chartData = c.query("SELECT * FROM cityCoordinates");
var coordArray = new Array(3);
coordArray[0] = new Array(2);
coordArray[1] = new Array(2);
coordArray[2] = new Array(2);
var j=0;
chartData.on('result',function(res) {
	res.on('row',function(row) {
		coordArray[j][0]=JSON.stringify({"X":inspect(row.CityXCoordinate)});
		coordArray[j][1]=JSON.stringify({"Y":inspect(row.CityYCoordinate)});
		j++;
		if(j==3) {
			console.log(coordArray);
		}
	});
<<<<<<< Updated upstream
});
=======
});
>>>>>>> Stashed changes
