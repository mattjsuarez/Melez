//Main running function of the project, other than the queries

//Actions to be performed when the document is ready
$(document).ready(function() {
    //Fade in the body, used in conjunction with the CSS body display property
    $('body').fadeIn(1500);
    //Climate view event handler - on click
    $("i[class*=nav-icon]").click(function() {
        //Get the icon's weather name - rain, snow or wind
        var pageData = $(this).attr("data-nav");
        //Hide initial instructions
        $("nav>p").css('display','none');
        //Send data to AJAX function
        changePage(pageData);
        //Style the navigation icons to selected
        $(this).addClass("selectedWeather");
        $(this).siblings().removeClass("selectedWeather");
    });
    //Form submit event handler
    $("#mainForm").submit(function(e) {
        //Serialize data for handling
        var data = $(this).serializeArray();
        //Processing to get into object
        data = JSON.stringify(data);
        data = JSON.parse(data);
        //Send request to server, to database
	console.log(data[0].value+data[1].value);
        var request = $.ajax({
            //Router intercepts this URL
            url:'/sendFormData/'+data[0].value+'/'+data[1].value,
            type:'GET',
            //Alert window on function finish
            success:function(msg) {
                alert(msg);
            },
	     error:function(jqXHR,textStatus,errorThrown) {
		  alert(jqXHR + textStatus + errorThrown);
            }
        });
        //Prevent page refresh on form submit
        return false;
    });
});
//Main AJAX calling function
function changePage(pageData) {
    //Ge the requested weather passed in from above
    var requested = pageData;
    //Send the request
    var request = $.ajax({
        //Router intercepts this URL
        url:'/updatePage/'+requested,
        type:'GET',
        success:function(msg) {
            //Process the response
            processData(msg,requested);
        }
    });
    //Debugging in console on error
    request.fail(function(jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
    });
}
//Process the received message from the AJAX call
//Gets the weather type to format the graphs and response text to process
function processData(responseData,requestedData) {
    //Arrays of city names, graph labels/colors, amounts of precipitation and final overall array to use for content generation, respectively
    var cityNames = new Array(3);
    var metaData = new Array(3);
    var cityAmounts = new Array(3);
    var finalContent = new Array(3);

    //Parse the city names into an object from each element - short loop, decided not to use for here
    cityNames[0] = JSON.parse(responseData[0][0]);
    cityNames[1] = JSON.parse(responseData[0][1]);
    cityNames[2] = JSON.parse(responseData[0][2]);
    
    //Switch statement for graph labels, units on the Y axis and the graph colors
    switch(requestedData) {
        case "snow":
            metaData[0]="Snowfall";
            metaData[1]="Inches";
            metaData[2]='#B3B0AF';
        break;
        case "rain":
            metaData[0]="Rainfall";
            metaData[1]="Inches";
            metaData[2]='#196CE8';        
        break;
        case "wind":
            metaData[0]="Wind";
            metaData[1]="Knots";
            metaData[2]='#666699';
        break;
        default:
            metaData[0]="Precipitation";
            metaData[1]="Amount";
            metaData[2]='red';
        break;
    }
    //Parse each row of city name, weather type and all 12 months into a JS Object and add to element of the array
    cityAmounts[0] = JSON.parse(responseData[1][0]);
    cityAmounts[1] = JSON.parse(responseData[1][1]);
    cityAmounts[2] = JSON.parse(responseData[1][2]);

    //Create final array to pass into the populating function
    finalContent[0] = cityNames;
    finalContent[1] = cityAmounts;
    finalContent[2] = metaData;
    //Call final, page populating function
    populatePage(finalContent);    
}
//Function will populate all of the headers and generate the charts from the passed in array
function populatePage(returnedData) {
    //Populate the arrays for easier access - again, names, amounts and metadata for the graphs
    var cityNames = returnedData[0];
    var cityAmounts = returnedData[1];
    var graphLabels = returnedData[2];
    //Find the city name cells in the table. Tried using pseudo selectors for this, but that didn't work.
    var nameCells = $(".cityNamePrimary");
    //Paragraph tags in h3 headers to populate with city names
    var containerHeaders = $("h3>p");
    //Chart containers on the page - each will be unique
    var $chartContainers = $(".chart");

    //Use all of the city names and populate the containers, along with the table cells with their names
    for(var i=0;i<3;i++) {
        cityNames[i] = JSON.parse(JSON.stringify(eval('('+cityNames[i]+')')));
        containerHeaders[i].innerHTML = cityNames[i].CityName;
        nameCells[i].innerHTML = cityNames[i].CityName;
    }
    //HighCharts universal options, before chart creation itself
    Highcharts.setOptions({
        colors: [graphLabels[2]], //colors taken from the array used
        xAxis: {
            title: {
                text: 'Months'    //Data is taken for months, so this is constant
            }
        }
    });
    //First graph out of three
    var primaryOptions = {
        chart: {
            renderTo:$chartContainers[0], //First container for the data
            type:'column',                //We want this to be a column graph
            spacingTop: 0,                //This and the next three and highchart container formatting settings
            spacingLeft: 0,               //Sort of overwrote these with my own CSS and modified the original highcharts.js,
            spacingRight: 0,              //but it's still good to keep these.
            spacingBottom: 0
        },
        title: {
            text: graphLabels[0]          //Label is chosen from the array - come to think of it now, I could have made this universal
        },
        yAxis: {
            title: {
                text: graphLabels[1]      //Axis label - again, could have been made universal
            }
        },
        series: [{}]                      //Series is left blank since this is set through an external JSON object passed into it
    };
    //Second graph - options are exactly the same, except for a different container being used
    var secondaryOptions = {
        chart: {
            renderTo:$chartContainers[1],
            type:'column',
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            spacingBottom: 0
        },
        title: {
            text:graphLabels[0]
        },
        yAxis: {
            title: {
                text: graphLabels[1]
            }
        },
        series: [{}]
    };
    //Same as last two, but again, different container
    var tertiaryOptions = {
        chart: {
            renderTo:$chartContainers[2],
            type:'column',
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            spacingBottom: 0
        },
        title: {
            text:graphLabels[0]
        },
        yAxis: {
            title: {
                text:graphLabels[1]
            }
        },
        series: [{}]
    };
    //Begin working on chart data - this is the fun part of JSON

    //dataSeries - array that will ultimately store the needed data for the graphs
    var dataSeries = new Array(3);

    //Placeholder for JSON processed data and keys for the loop
    var objectHolder = new Array(12);
    
    //The loop - will go through each city now, parse the stringified array
    //The placeholder will get it, and each of the 12 months will be addressed in turn, whilst being added to the final data series array
    for(var i=0;i<3;i++) {
        //Eval was used to turn a rather invalid JSON object to a valid one
        objectHolder[i] = JSON.parse(JSON.stringify(eval('('+cityAmounts[i]+')')));
        //Variable declaration here, less redundant
        dataSeries[i] = new Array(12);
        //The really fun stuff where I couldn't use a loop since the first 3 columns are ignored and looping would not allow me to properly
        //do this by enumerating the m1-12 variables. Oh well. Thank God for Sublime Text.
        dataSeries[i][0] = parseFloat(objectHolder[i].m1);
        dataSeries[i][1] = parseFloat(objectHolder[i].m2);
        dataSeries[i][2] = parseFloat(objectHolder[i].m3);
        dataSeries[i][3] = parseFloat(objectHolder[i].m4);
        dataSeries[i][4] = parseFloat(objectHolder[i].m5);
        dataSeries[i][5] = parseFloat(objectHolder[i].m6);
        dataSeries[i][6] = parseFloat(objectHolder[i].m7);
        dataSeries[i][7] = parseFloat(objectHolder[i].m8);
        dataSeries[i][8] = parseFloat(objectHolder[i].m9);
        dataSeries[i][9] = parseFloat(objectHolder[i].m10);
        dataSeries[i][10] = parseFloat(objectHolder[i].m11);
        dataSeries[i][11] = parseFloat(objectHolder[i].m12);
    }
    //Override the empty JSON parameter with the generated data series arrays from above - the fun loop, I call it
    primaryOptions.series[0].data = dataSeries[0];
    secondaryOptions.series[0].data = dataSeries[1];
    tertiaryOptions.series[0].data = dataSeries[2];
    
    //Create the graphs with the specified options
    var primaryChart = new Highcharts.Chart(primaryOptions);
    var secondaryChart = new Highcharts.Chart(secondaryOptions);
    var tertiaryChart = new Highcharts.Chart(tertiaryOptions);
}
//Yay, we are done! :D