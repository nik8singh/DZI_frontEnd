const url = "http://localhost:8080/coupon/";
let tableBody = ".tableBody";
let loading = "#loading";
let recordId;
let recordName;
let recordDiscount;
let recordStartDate;
let recordEndDate;
let recordStatus;
let cancelBtn;
let deleteBtn;
let applyBtn;
let isActive;
let previousName;
let previousStartDate;
let previousEndDate;
let previousDiscount;

$(window).on('load', function() {
    $.ajax({
        url: url + "all",
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            $.each(result, function (index, element) {
                createNewRecord(element.couponId, element.couponName, element.couponDiscountPercent, element.couponStartDate, element.couponEndDate);
            });

        },
        error: function (request, status, error) {
            console.log("Status: " + status);
            console.log("error: " + error);
            console.log("json not found: " + request.responseText);
        },
        complete: function (data) {

            $("#activePageCrumb").text("Coupons");
            $('#pageTitle').text("Coupons");
            $('#menu_coupon').addClass("active");
            $(loading).hide();
        }
    });
});

function showAlert(alertType, message, elementClass) {

    let done = "<div class=\"alert alert " + alertType + " alert-dismissable\">" + "<button type=\"button\" data-dismiss=\"alert\" aria-hidden=\"true\" class=\"close\">&times;</button>" + message + "</div>";
    $(elementClass).parent().append(done);
}

function createJsonObject(newItem) {

    let s = moment(recordStartDate.val());
    let e = moment(recordEndDate.val());

    let myObject = {
        couponName: recordName.val(),
        couponDiscountPercent: recordDiscount.val(),
        couponStartDate: s.format('x'),
        couponEndDate: e.format('x')
    };

    if (newItem === 0)
        myObject.couponId = recordId;

    return JSON.stringify(myObject);

}

function isCouponActive(startDate, endDate) {
    let a = new moment(startDate).format("YYYY-MM-DD");
    let b = new moment(endDate).format("YYYY-MM-DD");
    console.log("Checking Active Start: " + a);
    console.log("Checking Active End: " + b);
    let date = moment().format("YYYY-MM-DD");
    isActive = !(a > date) && (b > date);
}

function getElements(self) {
    recordName = $(self).parent().parent().find('td:nth-child(2)').find('input:first');
    recordDiscount = $(self).parent().parent().find('td:nth-child(3)').find('input:first');

    recordStartDate = $(self).parent().parent().find('td:nth-child(4)').find('input:first');

    recordEndDate = $(self).parent().parent().find('td:nth-child(5)').find('input:first');

    recordStatus = $(self).parent().parent().find('td:nth-child(6)').find('span:first');

    cancelBtn = $(self).parent().parent().find('td:nth-child(7)').find('a.cancelEditBtn');

    deleteBtn = $(self).parent().parent().find('td:nth-child(7)').find('a.deleteBtn');

    applyBtn = $(self).parent().parent().find('td:nth-child(7)').find('a.applyEditBtn');

    recordId = $(self).parent().parent().attr('id');

    isCouponActive(new Date(recordStartDate.val()), new Date(recordEndDate.val()));

    console.log(recordStartDate.val())

}

function createNewRecord(id, name, discount, start, end) {
    isCouponActive(start, end);
    let status;

    if (isActive)
        status = "<td><span class=\"label label-sm label-success\">Active</span></td>";
    else
        status = "<td><span class=\"label label-sm label-danger\">Inactive</span></td>";

    let record = "<tr id=\"" + id + "\">" +
        "<td><i class=\"fas fa-edit editIcon\"></i></td>" +
        "<td><input type=\"text\" value=\"" + name + "\" class=\"tableText\" disabled/></td>" +
        "<td><input type=\"number\" value=\"" + discount + "\"  min=\"1\" max=\"20\" class=\"tableText\" disabled/></td>" +
        "<td><input type=\"date\" class=\"inputDate startDate\" value=\"" + formatDate(start) + "\" disabled/></td>" +
        "<td><input type=\"date\" class=\"inputDate endDate\" value=\"" + formatDate(end) + "\" disabled/></td>" +
        status +
        "<td><a class=\"applyEditBtn itemButtons\" href=\"#\" hidden>Apply</a> " +
        "<a class=\"cancelEditBtn itemButtons\" href=\"#\" hidden>Cancel</a> " +
        "<a class=\"deleteBtn itemButtons\" href=\"#\" hidden>Delete</a> </td>" +
        "</tr>";
    $(".tableBody").prepend(record);
}

function modeChanger(disable) {
    recordName.prop('disabled', disable);
    recordDiscount.prop('disabled', disable);
    recordStartDate.prop('disabled', disable);
    recordEndDate.prop('disabled', disable);
    if (disable) {
        cancelBtn.hide();
        deleteBtn.hide();
        applyBtn.hide();

        recordStatus.removeClass("label-info");

        if (isActive) {
            recordStatus.text("Active");
            recordStatus.addClass("label-success");
        } else {
            recordStatus.text("Inactive");
            recordStatus.addClass("label-danger")
        }
    } else {
        recordStatus.removeClass("label-success label-danger");
        recordStatus.addClass("label-info");
        recordStatus.text("Pending");
        cancelBtn.show();
        deleteBtn.show();
        applyBtn.show();
    }
}

$('#addNewRecordBtn').on('click', function () {
    let r = "<tr>\n" +
        "<td><i class=\"fas fa-edit editIcon\"></i></td>\n" +
        "<td><input type=\"text\" class=\"tableText\"/></td>\n" +
        "<td><input type=\"number\" min=\"1\" max=\"100\" class=\"tableText\"/></td>\n" +
        "<td><input type=\"date\" class=\"inputDate startDate\"/></td>\n" +
        "<td><input type=\"date\" class=\"inputDate endDate\"/></td>\n" +
        "<td><span class=\"label label-sm label-info\">Pending</span></td>\n" +
        "<td><a class=\"addBtn itemButtons\" href=\"#\">Add</a> <a class=\"cancelBtn itemButtons\" href=\"#\">Cancel</a> </td>\n" +
        "</tr>";
    $(".tableBody").prepend(r);

    return false;
});

$(tableBody).on('click', ".cancelBtn", function () {
    $(this).parent().parent().remove();
    return false;
});

$(tableBody).on('click', ".editIcon", function () {
    getElements(this);
    previousName = recordName.val();
    previousEndDate = recordEndDate.val();
    previousStartDate = recordStartDate.val();
    previousDiscount = recordDiscount.val();
    modeChanger(false);
    return false;
});

$(tableBody).on('click', ".cancelEditBtn", function () {
    getElements(this);
    recordName.val(previousName);
    recordDiscount.val(previousDiscount);
    recordStartDate.val(previousStartDate);
    recordEndDate.val(previousEndDate);
    modeChanger(true);

    return false;
});

$(tableBody).on('click', ".addBtn", function () {

    $(loading).show();
    getElements(this);
    let data = createJsonObject(1);
    let self = this;

    $.ajax({
        url: url + "save",
        type: 'POST',
        data: data,
        contentType: 'application/json',
        success: function (result) {
            createNewRecord(result.couponId, result.couponName, result.couponDiscountPercent, result.couponStartDate, result.couponEndDate);
            $(self).parent().parent().remove();
            showAlert("alert-success", "<strong>" + name + "</strong>Coupon Added", ".page-header");

        },
        error: function (request, status, error) {

            showAlert("alert-danger", "Error Coupon NOT Added", ".page-header");
            console.log("Status: " + status);
            console.log("error: " + error);
            console.log("json not found: " + request.responseText);
        },
        complete: function (data) {

            $(loading).hide();
        }


    });



});

$(tableBody).on('click', ".deleteBtn", function () {
    let r = confirm("You are about to delete " + recordName.val() + " Coupon. Are you Sure?");
    if (r === true) {

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
                $(self).parent().parent().remove();
                showAlert("alert-warning", "Coupon Deleted", ".page-header");

            },
            error: function (request, status, error) {

                showAlert("alert-danger", "Error Coupon NOT Deleted", ".page-header");
                console.log("Status: " + status);
                console.log("error: " + error);
                console.log("json not found: " + request.responseText);
            },
            complete: function (data) {

                $(loading).hide();
            }


        });
    }

});

$(tableBody).on('click', ".applyEditBtn", function () {

    $(loading).show();
    getElements(this);
    let data = createJsonObject(0);

    $.ajax({
        url: url + "update",
        type: 'POST',
        data: data,
        contentType: 'application/json',
        success: function (result) {

            modeChanger(true);

            showAlert("alert-success", "<strong>" + recordName.val() + "</strong> Coupon Updated", ".page-header");

        },
        error: function (request, status, error) {

            showAlert("alert-danger", "Error Coupon NOT Added", ".page-header");
            console.log("Status: " + status);
            console.log("error: " + error);
            console.log("json not found: " + request.responseText);

            showAlert("alert-danger", "ERROR: <strong>" + recordName.val() + "</strong> Coupon NOT updated", ".page-header");
        },
        complete: function (data) {

            $(loading).hide();
        }


    });

});

function formatDate(inputDate) {

    return new moment(inputDate).format("YYYY-MM-DD");
}
