const url = "http://localhost:8080/shop/";
let loading = "#loading";
let recordId;
let recordName;
let recordDescription;
let cancelBtn;
let deleteBtn;
let applyBtn;
let addressId;
let addressName;
let addressStreet;
let addressUnit;
let addressCity;
let addressState;
let addressZipcode;
let addressCountry;
let editModeFlag = false;

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
                let addId = element.shopAddress.addressId;
                let addStreet = element.shopAddress.addressStreet;
                let addCity = element.shopAddress.addressCity;
                let addUnit = element.shopAddress.addressUnit;
                let addState = element.shopAddress.addressState;
                let addZipcode = element.shopAddress.addressZipcode;

                createRecord(id, name, description, addId, addName, addStreet, addCity, addUnit, addState, addZipcode);
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

let originalName, originalDescription, originalAddName, originalAddStreet, originalAddUnit, originalAddCity, originalAddState, originalAddZipcode;

$("table").on('click', '.header', function (event) {

    if (event.target.getAttribute("class") === "svg-inline--fa fa-edit fa-w-18 editIcon" || event.target.getAttribute("class") === "editIcon") {

        $(this).closest("tr").find("td:first").html("-");
        $(this).toggleClass('expand').nextUntil("tr.header").slideDown();
        getElements(this);
        modeChanger(false);
        editModeFlag = true;
        originalName = recordName.val();
        originalDescription = recordDescription.val();
        originalAddName = addressName.val();
        originalAddStreet = addressStreet.val();
        originalAddUnit = addressUnit.val();
        originalAddCity = addressCity.val();
        originalAddState = addressState.val();
        originalAddZipcode = addressZipcode.val();

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
                // showAlert("alert-warning", "Coupon Deleted", ".page-header");
                modeChanger(true);
                editModeFlag = false;

            },
            error: function (request, status, error) {

                // showAlert("alert-danger", "Error Coupon NOT Deleted", ".page-header");
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
        addressStreet.val(originalAddStreet);
        addressUnit.val(originalAddUnit);
        addressCity.val(originalAddCity);
        addressState.val(originalAddState);
        addressZipcode.val(originalAddZipcode);
        modeChanger(true);
        editModeFlag = false;

    }
    else if (event.target.getAttribute("class") === "deleteBtn itemButtons") {

        editModeFlag = false;
        let r = confirm("You are about to delete " + recordName.val() + " Shop. Are you Sure?");
        if (r === true) {

            $(loading).show();
            getElements(this);
            let data = createJsonObject(0);
            alert(JSON.stringify(data));
            let self = this;
            $.ajax({
                url: url + "delete",
                type: 'DELETE',
                data: data,
                contentType: 'application/json',
                success: function (result) {
                    $(self).nextUntil("tr.header").remove();
                    $(self).remove();
                    // showAlert("alert-warning", "Coupon Deleted", ".page-header");

                },
                error: function (request, status, error) {
                    // showAlert("alert-danger", "Error Coupon NOT Deleted", ".page-header");
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
    addressName = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:first');
    addressStreet = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(4)').find('input:first');
    addressUnit = $(self).closest('tr').next('tr').next('tr').find('td:nth-child(5)').find('input:first');
    addressCity = $(self).closest('tr').next('tr').next('tr').next('tr').next('tr').find('td:nth-child(3)').find('input:first');
    addressState = $(self).closest('tr').next('tr').next('tr').next('tr').next('tr').find('td:nth-child(4)').find('input:first');
    addressZipcode = $(self).closest('tr').next('tr').next('tr').next('tr').next('tr').find('td:nth-child(5)').find('input:first');
    applyBtn = $(self).find('td:nth-child(5)').find("a.applyEditBtn.itemButtons");
    cancelBtn = $(self).find('td:nth-child(5)').find("a.cancelEditBtn.itemButtons");
    deleteBtn = $(self).find('td:nth-child(5)').find("a.deleteBtn.itemButtons");
}

function createRecord(id, name, description, addId, addName, addStreet, addCity, addUnit, addState, addZipcode) {
    let record = "<tr class=\"header expand\" id = \"" + id + "\">" +
        "<td class=\"tableText\">+</td>" +
        "<td class='editIcon'><i class=\"fas fa-edit editIcon\"></i></td>" +
        "<td><input type=\"text\" value=\"" + name + "\" class=\"tableText\" disabled/></td>" +
        "<td><textarea type=\"text\" wrap=\"hard\" cols=\"60\" rows=\"1\" class=\"tableText\" disabled>" + description + "</textarea></td>" +
        "<td><a class=\"applyEditBtn itemButtons\" href=\"#\" hidden>Apply</a>" +
        "<a class=\"cancelEditBtn itemButtons\" href=\"#\" style=\"padding-left: 10px\" hidden>Cancel</a>" +
        "<a class=\"deleteBtn itemButtons\" href=\"#\" hidden>Delete</a></td>" +
        "</tr>" +
        "<tr hidden class=\"addressRow\" id='" + addId + "'>" +
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
    recordName.prop('disabled', disable);
    recordDescription.prop('disabled', disable);
    addressName.prop('disabled', disable);
    addressStreet.prop('disabled', disable);
    addressUnit.prop('disabled', disable);
    addressCity.prop('disabled', disable);
    addressState.prop('disabled', disable);
    addressZipcode.prop('disabled', disable);
    if (disable) {
        cancelBtn.hide();
        deleteBtn.hide();
        applyBtn.hide();
    } else {
        cancelBtn.show();
        deleteBtn.show();
        applyBtn.show();
    }
}

function createJsonObject(newItem) {

    let myObject = {

        shopName: recordName.val(),
        shopDescription: recordDescription.val(),
        shopAddress:
            {
                addressFullname: addressName.val(),
                addressStreet: addressStreet.val(),
                addressUnit: addressUnit.val(),
                addressCity: addressCity.val(),
                addressState: addressState.val(),
                addressZipcode: addressZipcode.val()
            }
    };

    if (newItem === 0) {
        myObject.shopId = recordId;
        myObject.shopAddress.addressId = addressId;
    }

    return JSON.stringify(myObject);

}