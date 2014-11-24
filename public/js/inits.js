$(document).ready(function() {
    //window.alert("Document ready!");
    $("i[class*=nav-icon]").click(function() {
        var pageData = $(this).attr("data-nav");
        $("nav>p").css('display','none');
        changePage(pageData);
    });
});
function changePage(pageData) {
    var requested = pageData;
}
function populatePage(returnedData) {
    var cityNames = returnedData[0];
    var cityAmounts = returnedData[1];
    var chartData = returnedData[2];
    var cityXY = returnedData[3];
    //Populate names
    var nbody = $("#names>table>tbody");
    //Populate amounts
    var abody = $("#amounts>table>tbody");
}