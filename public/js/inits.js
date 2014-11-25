$(document).ready(function() {
    $('body').fadeIn(1500);
    $("i[class*=nav-icon]").click(function() {
        var pageData = $(this).attr("data-nav");
        $("nav>p").css('display','none');
        changePage(pageData);
        $(this).addClass("selectedWeather");
        $(this).siblings().removeClass("selectedWeather");
    });
    $("#mainForm").submit(function(e) {
        var data = $(this).serializeArray();
        data = JSON.stringify(data);
        data = JSON.parse(data);
        console.log(data[0].value);
        console.log(data[1].value);
        var request = $.ajax({
            url:'/sendFormData/'+data[0].value+','+data[1].value,
            type:'GET',
            success:function(msg) {
                alert(msg);
            }
        });
        return false;
    });
});
function changePage(pageData) {
    var requested = pageData;
    var request = $.ajax({
        url:'/updatePage/'+requested,
        type:'GET',
        success:function(msg) {
            processData(msg,requested);
        }
    });
    request.fail(function(jqXHR, textStatus) {
        console.log("Request failed: " + textStatus);
    });
}
function processData(responseData,requestedData) {
    var cityNames = new Array(3);
    var metaData = new Array(3);
    var cityAmounts = new Array(3);
    var finalContent = new Array(3);
    
    cityNames[0] = JSON.parse(responseData[0][0]);
    cityNames[1] = JSON.parse(responseData[0][1]);
    cityNames[2] = JSON.parse(responseData[0][2]);
    
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

    cityAmounts[0] = JSON.parse(responseData[1][0]);
    cityAmounts[1] = JSON.parse(responseData[1][1]);
    cityAmounts[2] = JSON.parse(responseData[1][2]);
    finalContent[0] = cityNames;
    finalContent[1] = cityAmounts;
    finalContent[2] = metaData;
    populatePage(finalContent);    
}
function populatePage(returnedData) {
    var cityNames = returnedData[0];
    var cityAmounts = returnedData[1];
    var graphLabels = returnedData[2];
    var nameCells = $(".cityNamePrimary");
    var containerHeaders = $("h3>p");
    var $chartContainers = $(".chart");

    for(var i=0;i<3;i++) {
        cityNames[i] = JSON.parse(JSON.stringify(eval('('+cityNames[i]+')')));
        containerHeaders[i].innerHTML = cityNames[i].CityName;
        nameCells[i].innerHTML = cityNames[i].CityName;
    }
    Highcharts.setOptions({
        colors: [graphLabels[2]],
        xAxis: {
            title: {
                text: 'Months'
            }
        }
    });
    var primaryOptions = {
        chart: {
            renderTo:$chartContainers[0],
            type:'column',
            spacingTop: 0,
            spacingLeft: 0,
            spacingRight: 0,
            spacingBottom: 0
        },
        title: {
            text: graphLabels[0]
        },
        yAxis: {
            title: {
                text: graphLabels[1]
            }
        },
        series: [{}]
    };
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
    var dataSeries = new Array(3);
    var objectHolder = new Array(12);
    for(var i=0;i<3;i++) {
        objectHolder[i] = JSON.parse(JSON.stringify(eval('('+cityAmounts[i]+')')));
        dataSeries[i] = new Array(12);
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
    primaryOptions.series[0].data = dataSeries[0];
    secondaryOptions.series[0].data = dataSeries[1];
    tertiaryOptions.series[0].data = dataSeries[2];
    
    var primaryChart = new Highcharts.Chart(primaryOptions);
    var secondaryChart = new Highcharts.Chart(secondaryOptions);
    var tertiaryChart = new Highcharts.Chart(tertiaryOptions);
}