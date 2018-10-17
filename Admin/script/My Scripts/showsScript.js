const url = "http://localhost:8080/shop/";
let loading = "#loading";
let recordId;
let recordName;
let recordDescription;
let cancelBtn;
let deleteBtn;
let applyBtn;
let addressName;
let addressStreet;
let addressUnit;
let addressCity;
let addressState;
let addressZipcode;
let addressCountry;

$(window).on('load', function () {

    $.ajax({
        url: url + "all",
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            $.each(result, function (index, element) {

                let startDate = moment(element.shopStartDate).format("YYYY-MM-DD HH:mm:ss");
                let endDate = moment(element.shopEndDate).format("YYYY-MM-DD HH:mm:ss");
                let id = element.shopId;
                let name = element.shopName;
                let description = element.shopDescription;
                let addName = element.shopAddress.addressFullname;
                let addStreet = element.shopAddress.addressStreet;
                let addCity = element.shopAddress.addressCity;
                let addUnit = element.shopAddress.addressUnit;
                let addState = element.shopAddress.addressState;
                let addZipcode = element.shopAddress.addressZipcode;
                createRecord(id,name,description,addName,addStreet, addCity, addUnit, addState, addZipcode);
                //booth: element.boothNumber, start: startDate, end:endDate

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
            $('#menu_show').addClass("active");

            $(loading).hide();

        }
    });
});

$("table").on('click', '.header', function (event) {

    showAddress($(this));

    if (event.target.getAttribute("class") === "svg-inline--fa fa-edit fa-w-18 editIcon") {

    }
});

function showAddress(self) {

    event.stopPropagation();

    self.toggleClass('expand').nextUntil("tr.header").slideToggle(100);

    if (self.closest("tr").find("td:first").text() === "+")
        self.closest("tr").find("td:first").html("-");
    else
        self.closest("tr").find("td:first").html("+");

}

function createRecord(id,name,description,addName,addStreet, addCity, addUnit, addState, addZipcode) {
    let record = "<tr class=\"header expand\" id = \"" + id + "\">" +
        "<td class=\"tableText\">+</td>" +
        "<td><i class=\"fas fa-edit editIcon\"></i></td>" +
        "<td><input type=\"text\" value=\"" + name + "\" class=\"tableText\" disabled/></td>" +
        "<td><textarea type=\"text\" wrap=\"hard\" cols=\"60\" rows=\"1\" class=\"tableText\" disabled>" + description + "</textarea></td>" +
        "<td><a class=\"applyEditBtn itemButtons\" href=\"#\" hidden>Apply</a>" +
        "<a class=\"cancelEditBtn itemButtons\" href=\"#\" style=\"padding-left: 10px\" hidden>Cancel</a>" +
        "<a class=\"deleteBtn itemButtons\" href=\"#\" hidden>Delete</a></td>" +
        "</tr>" +
        "<tr hidden class=\"addressRow\">" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:20%;\">Address Name</th>" +
        "<th style=\"width:20%;\">Street</th>" +
        "<th style=\"width:10%;\">Unit</th>" +
        "</tr>" +
        "<tr hidden class=\"addressRow\">" +
        "<td></td><td></td>" +
        "<td class=\"tableText\" disabled><input type=\"text\" value=\"" + addName + "\" class=\"tableText\" disabled/></td>" +
        "<td class=\"tableText\" disabled><input type=\"text\" value=\"" + addStreet + "\" class=\"tableText\" disabled/></td>" +
        "<td class=\"tableText\" disabled><input type=\"text\" value=\"" + addUnit + "\" class=\"tableText\" disabled/></td></tr>" +
        "<tr hidden class=\"addressRow\">" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:20%;\">City</th>" +
        "<th style=\"width:5%;\">State</th>" +
        "<th style=\"width:5%;\">Zipcode</th>" +
        "</tr>" +
        "<tr hidden class=\"addressRow\">" +
        "<td></td><td></td>" +
        "<td class=\"tableText\" disabled><input type=\"text\" value=\"" + addCity + "\" class=\"tableText\" disabled/></td>" +
        "<td class=\"tableText\" disabled><input type=\"text\" value=\"" + addState + "\" class=\"tableText\" disabled/></td>" +
        "<td class=\"tableText\" disabled><input type=\"text\" value=\"" + addZipcode + "\" class=\"tableText\" disabled/></td>" +
        "</tr>";

    $(".tableBody").prepend(record);
}

function modeChanger(disable) {
    // recordName.prop('disabled', disable);
    // recordDiscount.prop('disabled', disable);
    // recordStartDate.prop('disabled', disable);
    // recordEndDate.prop('disabled', disable);
    // if (disable) {
    //     cancelBtn.hide();
    //     deleteBtn.hide();
    //     applyBtn.hide();
    //
    //     recordStatus.removeClass("label-info");
    //
    //     if (isActive) {
    //         recordStatus.text("Active");
    //         recordStatus.addClass("label-success");
    //     } else {
    //         recordStatus.text("Inactive");
    //         recordStatus.addClass("label-danger")
    //     }
    // } else {
    //     recordStatus.removeClass("label-success label-danger");
    //     recordStatus.addClass("label-info");
    //     recordStatus.text("Pending");
    //     cancelBtn.show();
    //     deleteBtn.show();
    //     applyBtn.show();
    // }
}
