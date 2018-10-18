const url = "http://localhost:8080/shop/";
let loading = "#loading";
let recordId;
let recordName;
let recordDescription;
let boothNumber;
let cancelBtn;
let deleteBtn;
let applyBtn;
let addressId;
let addressName;
let addressLineOne;
let addressLineTwo;
let addressCity;
let addressState;
let addressZipcode;
let addressCountry;
let startDate;
let endDate;
let editModeFlag = false;
let tableBody = ".tableBody";

$(window).on('load', function () {

    $.ajax({
        url: url + "all",
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            $.each(result, function (index, element) {
                let start = element.shopStartDate;
                let end = element.shopEndDate;
                let id = element.shopId;
                let name = element.shopName;
                let description = element.shopDescription;
                let addName = element.shopAddress.addressFullname;
                let addId = element.shopAddress.addressId;
                let addLineOne = element.shopAddress.addressLineOne;
                let addCity = element.shopAddress.addressCity;
                let addLineTwo = element.shopAddress.addressLineTwo;
                let addState = element.shopAddress.addressState;
                let addZipcode = element.shopAddress.addressZipcode;
                let addCountry = element.shopAddress.addressCountry;
                let booth = element.boothNumber;

                createRecord(id, name, description, addId, addName, addLineOne, addCity, addLineTwo, addState, addZipcode, addCountry, booth, start, end);

                if (moment(end).format("YYYY-MM-DD") >= moment().format("YYYY-MM-DD") && end)
                    addToEvent(name, booth, start, end);

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

function showAlert(alertType, message, elementClass) {

    let done = "<div class=\"alert " + alertType + " \">" + "<button type=\"button\" data-dismiss=\"alert\" aria-hidden=\"true\" class=\"close\">&times;</button>" + message + "</div>";
    $(elementClass).parent().append(done);
}

let originalName, originalDescription, originalAddName, originalAddLineOne, originalAddLineTwo, originalAddCity,
    originalAddState, originalAddZipcode, originalCountry, originalBoothNumber;

$(tableBody).on('click', '.header', function (event) {

    if (!editModeFlag && (event.target.getAttribute("class") === "svg-inline--fa fa-edit fa-w-18 editIcon" || event.target.getAttribute("class") === "editIcon")) {

        $(this).closest("tr").find("td:first").html("-");
        $(this).toggleClass('expand').nextUntil("tr.header").slideDown();
        getElements(this);
        modeChanger(false, this);
        editModeFlag = true;
        originalName = recordName.val();
        originalDescription = recordDescription.val();
        originalAddName = addressName.val();
        originalAddLineOne = addressLineOne.val();
        originalAddLineTwo = addressLineTwo.val();
        originalAddCity = addressCity.val();
        originalAddZipcode = addressZipcode.val();
        originalAddState = addressState.val();
        originalCountry = addressCountry.val();
        originalBoothNumber = boothNumber.val();
    }
    else if (event.target.getAttribute("class") === "applyEditBtn itemButtons") {
        $(loading).show();
        getElements(this);
        let data = createJsonObject(0);
        let self = this;

        $.ajax({
            url: url + "update",
            type: 'POST',
            data: data,
            contentType: 'application/json',
            success: function (result) {
                showAlert("alert-success", "Show Modified", ".page-header");
                modeChanger(true, self);
                editModeFlag = false;

            },
            error: function (request, status, error) {

                showAlert("alert-danger", "Error Show NOT Modified", ".page-header");
                console.log("Status: " + status);
                console.log("error: " + error);
                console.log("json not found: " + request.responseText);
            },
            complete: function (data) {

                $(loading).hide();
            }


        });

    }
    else if (event.target.getAttribute("class") === "cancelEditBtn itemButtons") {

        recordName.val(originalName);
        recordDescription.val(originalDescription);
        addressName.val(originalAddName);
        addressLineOne.val(originalAddLineOne);
        addressLineTwo.val(originalAddLineTwo);
        addressCity.val(originalAddCity);
        addressState.val(originalAddState);
        addressZipcode.val(originalAddZipcode);
        addressCountry.val(originalCountry);
        modeChanger(true, this);
        editModeFlag = false;

    }
    else if (event.target.getAttribute("class") === "deleteBtn itemButtons") {

        let r = confirm("You are about to delete \"" + recordName.val() + "\" Shop. Are you Sure?");
        if (r === true) {
            editModeFlag = false;
            $(loading).show();
            getElements(this);
            let data = createJsonObject(0);

            let self = this;
            $.ajax({
                url: url + "delete",
                type: 'DELETE',
                data: data,
                contentType: 'application/json',
                success: function (result) {
                    $(self).nextUntil("tr.header").remove();
                    $(self).remove();
                    showAlert("alert-warning", "Show Deleted", ".page-header");

                },
                error: function (request, status, error) {
                    showAlert("alert-danger", "Error Show NOT Deleted", ".page-header");
                    console.log("Status: " + status);
                    console.log("error: " + error);
                    console.log("json not found: " + request.responseText);
                },
                complete: function (data) {

                    $(loading).hide();
                }


            });
        }


    }
    else if (!editModeFlag) {
        showAddress($(this));
    }
    return false;
});

function showAddress(self) {

    event.stopPropagation();

    self.toggleClass('expand').nextUntil("tr.header").slideToggle(100);

    if (self.closest("tr").find("td:first").text() === "+")
        self.closest("tr").find("td:first").html("-");
    else
        self.closest("tr").find("td:first").html("+");

}

function getElements(self) {

    recordId = $($(self)).attr("id");
    recordName = $(self).find('td:nth-child(3)').find('input:first');
    recordDescription = $(self).find('td:nth-child(4)').find('textarea:first');
    addressId = $($(self).closest('tr').next('tr')).attr("id");
    applyBtn = $(self).find('td:nth-child(5)').find("a.applyEditBtn.itemButtons");
    cancelBtn = $(self).find('td:nth-child(5)').find("a.cancelEditBtn.itemButtons");
    deleteBtn = $(self).find('td:nth-child(5)').find("a.deleteBtn.itemButtons");
    addressName = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:nth-child(2)');
    addressLineOne = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:nth-child(5)');
    addressLineTwo = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:nth-child(8)');
    addressCity = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:nth-child(11)');
    addressState = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:nth-child(14)');
    addressZipcode = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:nth-child(17)');
    addressCountry = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:nth-child(20)');
    boothNumber = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(4)').find('input:first');
    startDate = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(5)').find('input.inputDate.startDate');
    endDate = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(5)').find('input.inputDate.endDate');

}

function createRecord(id, name, description, addId, addName, addLineOne, addCity, addLineTwo, addState, addZipcode, addCountry, booth, start, end) {

    let record = "<tr class=\"header expand\" id = \"" + id + "\">" +
        "<td class=\"tableText\">+</td>" +
        "<td class='editIcon'><a href='#' class='editIcon'>Edit</a></td>" + //<i class="fas fa-edit editIcon"></i>
        "<td><input type=\"text\" value=\"" + name + "\" class=\"tableText\" style='font-weight: bold' disabled/></td>" +
        "<td><textarea type=\"text\" wrap=\"hard\" cols=\"30\" rows=\"1\" class=\"tableText\" style='font-weight: bold' disabled>" + description + "</textarea></td>" +
        "<td><a class=\"applyEditBtn itemButtons\" href=\"#\" hidden>Apply</a>" +
        "<a class=\"cancelEditBtn itemButtons\" href=\"#\" style=\"padding-left: 10px\" hidden>Cancel</a>" +
        "<a class=\"deleteBtn itemButtons\" href=\"#\" hidden>Delete</a></td>" +
        "</tr>" +
        "<tr hidden class=\"addressRow\" id='" + addId + "'>" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:10%;\">Address</th>" +
        "<th style=\"width:10%;\">Booth Number</th>" +
        "<th style=\"width:10%;\">Dates</th>" +
        "</tr>" +
        "<tr hidden class=\"addressRow\">" +
        "<td></td><td></td>" +
        "<td><label class='addressLabel' hidden>Name on Add:</label><input type=\"text\" value=\"" + addName + "\" class=\"tableText\" disabled/>" +
        "<br><label class='addressLabel' hidden>Add. Line 1:</label><input type=\"text\" value=\"" + addLineOne + "\" class=\"tableText\" disabled/>" +
        "<br><label class='addressLabel' hidden>Add. Line 2:</label><input type=\"text\" value=\"" + addLineTwo + "\" class=\"tableText\" disabled/> " +
        "<br><label class='addressLabel' hidden>City:</label><input type=\"text\" value=\"" + addCity + "\" class=\"tableText\" disabled/>" +
        "<br><label class='addressLabel' hidden>State:</label><input type=\"text\" value=\"" + addState + "\" class=\"tableText\" disabled/>" +
        "<br><label class='addressLabel' hidden>Zipcode:</label><input type=\"text\" value=\"" + addZipcode + "\" class=\"tableText\" disabled/>" +
        "<br><label class='addressLabel' hidden>Country:</label><input type=\"text\" value=\"" + addCountry + "\" class=\"tableText\" disabled/></br>" +
        "<td><input type=\"text\" value=\"" + booth + "\" class=\"tableText\" disabled/></td>" +
        "<td><label class='addressLabel' >Start:</label>" +
        "<br><input type=\"date\" class=\"inputDate startDate\" class=\"tableText\"  value=\"" + formatDate(start) + "\" style='width:fit-content' disabled/>" +
        "<br><label class='addressLabel' >End:</label>" +
        "<br><input type=\"date\" class=\"inputDate endDate\" class=\"tableText\" value=\"" + formatDate(end) + "\" style='width:fit-content' disabled/></td>" +
        "</tr>";

    $(".tableBody").prepend(record);
}

function addToEvent(name, booth, start, end) {
    let record = " <tr>\n" +
        "<td><input type=\"text\" value=\"" + name + "\" class=\"tableText\" disabled/></td>\n" +
        "<td><input type=\"text\" value=\"" + booth + "\" class=\"tableText\" disabled/></td>\n" +
        "<td><input type=\"date\" class=\"inputDate startDate\" value=\"" + formatDate(start) + "\" class=\"tableText\" disabled/></td>\n" +
        "<td><input type=\"date\" class=\"inputDate endDate\" value = \"" + formatDate(end) + "\"class=\"tableText\" disabled/></td>\n" +
        "</tr>";

    $(".eventTableBody").prepend(record);
}

function modeChanger(disable, self) {
    recordName.prop('disabled', disable);
    recordDescription.prop('disabled', disable);
    addressName.prop('disabled', disable);
    addressLineOne.prop('disabled', disable);
    addressLineTwo.prop('disabled', disable);
    addressCity.prop('disabled', disable);
    addressState.prop('disabled', disable);
    addressZipcode.prop('disabled', disable);
    addressCountry.prop('disabled', disable);
    boothNumber.prop('disabled', disable);
    startDate.prop('disabled', disable);
    endDate.prop('disabled', disable);

    if (disable) {
        cancelBtn.hide();
        deleteBtn.hide();
        applyBtn.hide();
        for (let i = 1; i < 20; i += 3)
            $(self).closest('tr').next('tr').next('tr').find('td:nth-child(3)').find('label:nth-child(' + i + ')').hide();
    } else {
        cancelBtn.show();
        deleteBtn.show();
        applyBtn.show();
        for (let i = 1; i < 20; i += 3)
            $(self).closest('tr').next('tr').next('tr').find('td:nth-child(3)').find('label:nth-child(' + i + ')').show();


    }
}

function createJsonObject(newItem) {

    let myObject = {

        shopName: recordName.val(),
        shopDescription: recordDescription.val(),
        boothNumber: boothNumber.val(),
        shopAddress:
            {
                addressFullname: addressName.val(),
                addressLineOne: addressLineOne.val(),
                addressLineTwo: addressLineTwo.val(),
                addressCity: addressCity.val(),
                addressState: addressState.val(),
                addressZipcode: addressZipcode.val(),
                addressCountry: addressCountry.val(),
            }
    };

    if (startDate.val()) {
        myObject.shopStartDate = moment(startDate.val()).format('x');
        myObject.shopEndDate = moment(endDate.val()).format('x');
    }

    if (newItem === 0) {
        myObject.shopId = recordId;
        myObject.shopAddress.addressId = addressId;
    }

    return JSON.stringify(myObject);

}

$('#addNewRecordBtn').on('click', function () {

    let r = "<tr>" +
        "<td class=\"tableText\">-</td>" +
        "<td>New</td>" +
        "<td><input id = \"newName\" type=\"text\" class=\"tableText\" /></td>" +
        "<td><textarea id= \"newDesc\" type=\"text\" wrap=\"hard\" cols=\"35\" rows=\"1\" class=\"tableText\"></textarea></td>" +
        "<td><a class=\"addBtn itemButtons\" href=\"#\">Add</a>" +
        "<a class=\"cancelBtn itemButtons\" href=\"#\" style=\"padding-left:10px\">Cancel</a>" +
        "</tr>" +
        "<tr  class=\"addressRow\">" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:10%;\">Address Name</th>" +
        "<th style=\"width:10%;\">Address Line 1</th>" +
        "<th style=\"width:10%;\">Address Line 2</th>" +
        "</tr>" +
        "<tr  class=\"addressRow\">" +
        "<td></td><td></td>" +
        "<td><input type=\"text\" class=\"tableText\" /></td>" +
        "<td><input type=\"text\" class=\"tableText\" /></td>" +
        "<td><input type=\"text\" class=\"tableText\" /></td>" +
        "</tr>" +
        "<tr  class=\"addressRow\">" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:10%;\">City</th>" +
        "<th style=\"width:5%;\">State</th>" +
        "<th style=\"width:5%;\">Zipcode</th>" +
        "</tr>" +
        "<tr  class=\"addressRow\">" +
        "<td></td><td></td>" +
        "<td><input type=\"text\" class=\"tableText\" /></td>" +
        "<td><input type=\"text\" class=\"tableText\" /></td>" +
        "<td><input type=\"text\" class=\"tableText\" /></td>" +
        "</tr>" +
        "<tr class=\"addressRow\">" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:2%;\"></th>" +
        "<th style=\"width:10%;\">Country</th>" +
        "<th style=\"width:10%;\">Booth Number</th>" +
        "</tr>" +
        "<tr class=\"addressRow\">" +
        "<td></td><td></td>" +
        "<td><input type=\"text\" class=\"tableText\"/></td>" +
        "<td><input type=\"text\" class=\"tableText\"/></td>" +
        "</tr>"

    ;

    $(tableBody).prepend(r);
    editModeFlag = true;
    return false;
});

$(tableBody).on('click', ".cancelBtn", function () {
    $(this).parent().parent().nextUntil("tr.header").remove();
    $(this).parent().parent().remove();
    editModeFlag = false;
    return false;
});

$(tableBody).on('click', ".addBtn", function () {

    $(loading).show();
    getElements(this);
    recordName = $("#newName");
    recordDescription = $("#newDesc");
    addressName = $(this).closest('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:first');
    addressLineOne = $(this).closest('tr').next('tr').next('tr').find('td:nth-child(4)').find('input:first');
    addressLineTwo = $(this).closest('tr').next('tr').next('tr').find('td:nth-child(5)').find('input:first');
    addressCity = $(this).closest('tr').next('tr').next('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:first');
    addressState = $(this).closest('tr').next('tr').next('tr').next('tr').next('tr').find('td:nth-child(4)').find('input:first');
    addressZipcode = $(this).closest('tr').next('tr').next('tr').next('tr').next('tr').find('td:nth-child(5)').find('input:first');
    addressCountry = $(this).closest('tr').next('tr').next('tr').next('tr').next('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:first');
    boothNumber = $(this).closest('tr').next('tr').next('tr').next('tr').next('tr').next('tr').next('tr').find('td:nth-child(4)').find('input:first');
    let data = createJsonObject(1);
    let self = this;

    $.ajax({
        url: url + "save",
        type: 'POST',
        data: data,
        contentType: 'application/json',
        success: function (result) {
            let id = result.shopId;
            let name = result.shopName;
            let description = result.shopDescription;
            let addName = result.shopAddress.addressFullname;
            let addId = result.shopAddress.addressId;
            let addLineOne = result.shopAddress.addressLineOne;
            let addCity = result.shopAddress.addressCity;
            let addLineTwo = result.shopAddress.addressLineTwo;
            let addState = result.shopAddress.addressState;
            let addZipcode = result.shopAddress.addressZipcode;
            let addCountry = result.shopAddress.addressCountry;
            let booth = result.boothNumber;

            $(self).parent().parent().nextUntil("tr.header").remove();
            $(self).parent().parent().remove();

            createRecord(id, name, description, addId, addName, addLineOne, addCity, addLineTwo, addState, addZipcode, addCountry, booth, null, null);
            editModeFlag = false;

            showAlert("alert-success", "<strong>" + name + "</strong> Show Added", ".page-header");

        },
        error: function (request, status, error) {

            showAlert("alert-danger", "Error Show NOT Added", ".page-header");
            console.log("Status: " + status);
            console.log("error: " + error);
            console.log("json not found: " + request.responseText);
        },
        complete: function (data) {

            $(loading).hide();

        }


    });


});

function formatDate(inputDate) {

    return new moment(inputDate).format("YYYY-MM-DD");
}
