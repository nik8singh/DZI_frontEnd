const url = "http://localhost:8080/shop/";

let input ="";
$(function () {
    $(window).on('load', function () {

         let events_array = [];

        $.ajax({
            url: url + "all",
            type: 'GET',
            dataType: 'json',
            success: function (result) {

                 $.each(result, function (index, element) {

                    let startDate = moment(element.shopStartDate).format("YYYY-MM-DD HH:mm:ss");
                    let endDate = moment(element.shopEndDate).format("YYYY-MM-DD HH:mm:ss");

                     // events_array.push({title:element.shopName, description: element.shopDescription, booth: element.boothNumber, start: startDate, end:endDate , nameOnAddress: element.shopAddress.addressFullname,
                     // street: element.shopAddress.addressStreet, unit:element.shopAddress.addressUnit, city:element.shopAddress.addressCity, state: element.shopAddress.addressState, zipcode:element.shopAddress.addressZipcode});
                     events_array.push({title:element.shopName, start: startDate, end:endDate});

                  });
            },
            error: function (request, status, error) {
                console.log("Status: " + status);
                console.log("error: " + error);
                console.log("json not found: " + request.responseText);
            },
            complete: function (data) {
                $("#activePageCrumb").text("Shows");
                $('#pageTitle').text("Shows");
                // $('#calendar').append(input);
                $('#menu_show').addClass("active");

                $('#calendar').fullCalendar({

                    // put your options and callbacks here
                    default: 'bootstrap3',

                    header: {
                        left: 'prevYear,nextYear',
                        center: 'title',
                        right: 'today,month,agendaDay,agendaWeek prev,next'
                    },

                    events: function (start, end, timezone, callback) {
                        callback(events_array);
                    },

                    dayClick: function () {
                    }
                });

                $(loading).hide();

            }
        });






    });
});

