const url = "http://localhost:8080/show/";

$(function () {

    let events_array=[];

    $.ajax({
        url: url + "all",
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            console.log(JSON.stringify(result));

            // $.each(result, function (index, element) {
            //     events_array.push({title:element.showName, description: element.showDescription, booth: element.boothNumber, start: element.startDate, end: element.endDate});
            // });

        },
        error: function (request, status, error) {
            console.log("Status: " + status);
            console.log("error: " + error);
            console.log("json not found: " + request.responseText);
        },
        complete: function (data) {

            $(loading).hide();
        }
    });


    $('#calendar').fullCalendar({

        // put your options and callbacks here
        default: 'bootstrap3',

        header:{
            left:'prevYear,nextYear',
            center:'title',
            right:'today,month,agendaDay,agendaWeek prev,next'
        },

        dayClick: function() {
        }
    });

});