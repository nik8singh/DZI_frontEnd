const url = "http://localhost:8080/metal/";
let loading = "#loading";
$(function () {

    $.ajax({
        url: url + "all",
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            let i = 0;
            $.each(result, function (index, element) {
                let updatedDate = formatDate(element.updatedDate);
                let createdDate = formatDate(element.createdDate);
                if (i > 0) {
                    console.log("metalID: " + element.metalId + " || metalName: " + element.metalName + "|| metalDescription: " + element.metalDescription);
                    let r = "<tr class=\"tbl-item\" id=\"" + element.metalId + "\"> <td class=\"td-block\" style=\"width: 100%\">" + "<p class=\"date\">" + createdDate + "</p>" + "<textarea  class=\"title itemEditableFields itemTitle \"  disabled>" + element.metalName + "</textarea>" + "<textarea class=\"desc itemDesc itemEditableFields\" disabled>" + element.metalDescription + "</textarea>" + "<p class=\"like\" style=\"float: left\"> Last Updated: " + updatedDate + "</p>" + "<a href=\"#\" class=\"itemButtons editItem\" >Edit</a>" + "<a class=\"updateItem itemButtons\" href=\"#\" hidden>Update</a>" + "<a class=\"cancelUpdateItem itemButtons\" href=\"#\" hidden>Cancel</a>" + "<a class=\"deleteItem itemButtons\" href=\"#\" hidden>Delete Metal</a>" + "</td></tr>";
                    $(".demo-tbl").prepend(r);
                } else {
                    console.log("First metalID: " + element.metalId + " || metalName: " + element.metalName + "|| metalDescription: " + element.metalDescription);
                    $('.itemCreatedDate').text(createdDate);
                    $('.itemUpdatedDate').text("Last Updated: " + updatedDate);
                    $('.itemTitle').text(element.metalName);
                    $('.itemDesc').text(element.metalDescription);
                    $('.tbl-item').attr('id', element.metalId);
                    $('.editItem').show();
                }
                i++;
            });
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


});

let gemName;
let gemDesc;
let editBtn;
let updateBtn;
let deleteBtn;
let cancelBtn;
let itemId;
let lastUpdateDate;
let tablesDivision = "#itemList";
let editingTitle;
let editingDesc;

function getElements(self) {
    gemName = $(self).parent().find('textarea:first');
    gemDesc = $(self).parent().find('textarea:nth-child(3)');
    editBtn = $(self).parent().find('a:first');
    lastUpdateDate = $(self).parent().find('p:nth-child(4)');
    updateBtn = $(self).parent().find('a:nth-child(6)');
    cancelBtn = $(self).parent().find('a:nth-child(7)');
    deleteBtn = $(self).parent().find('a:nth-child(8)');
    itemId = $(self).parent().parent().attr('id');

}

function createJsonObject(newItem) {
    let myObject = {
        metalName: gemName.val(),
        metalDescription: gemDesc.val()
    };

    if (newItem === 0)
        myObject.metalId = itemId;

    return JSON.stringify(myObject);

}

function getCurrentDate() {
    let fullDate = new Date();
    let twoDigitMonth = ((fullDate.getMonth().length + 1) === 1) ? (fullDate.getMonth() + 1) : '0' + (fullDate.getMonth() + 1);
    return twoDigitMonth + "/" + fullDate.getDate() + "/" + fullDate.getFullYear();

}

function showAlert(alertType, message, elementClass) {

    let done = "<div class=\"alert alert " + alertType + " alert-dismissable\">" + "<button type=\"button\" data-dismiss=\"alert\" aria-hidden=\"true\" class=\"close\">&times;</button>" + message + "</div>";
    $(elementClass).parent().append(done);
}

$(tablesDivision).on('click', '.editItem', function () {
    getElements(this);
    editingTitle = gemName.val();
    editingDesc = gemDesc.val();
    gemName.prop('disabled', false);
    gemDesc.prop('disabled', false);
    gemName.addClass("itemEditingMode");
    gemDesc.addClass("itemEditingMode");
    updateBtn.show();
    cancelBtn.show();
    deleteBtn.show();
    $(this).hide();
    return false;
});

$(tablesDivision).on('click', '.updateItem', function () {
    getElements(this);
    $(loading).show();
    $(this).prop('disabled', true);
    $(this).css('color', 'grey');
    cancelBtn.hide();
    let data = createJsonObject(0);
    let self = this;
    $.ajax({
        url: url + "update",
        type: 'POST',
        data: data,
        contentType: 'application/json',
        success: function (result, status) {
            lastUpdateDate.text(getCurrentDate);
            gemName.prop('disabled', true);
            gemDesc.prop('disabled', true);
            gemName.removeClass("itemEditingMode");
            gemDesc.removeClass("itemEditingMode");
            editBtn.show();
            $(self).hide();
            $(self).prop('disabled', false);
            $(self).css('color', 'darkred');
            deleteBtn.hide();
            showAlert("alert-success", "<strong>" + name + "</strong> metal updated Successfully", self);
        },
        error: function (request, status, error) {
            showAlert("alert-danger", "Error metal Not updated. Please try again later", self);
            console.log("Status: " + status);
            console.log("error: " + error);
            console.log("response: " + request.responseText);
        },
        complete: function (data) {

            $(loading).hide();
        }
    });
    return false;
});

$(tablesDivision).on('click', '.cancelUpdateItem', function () {
    getElements(this);
    gemName.val(editingTitle);
    gemDesc.val(editingDesc);
    gemName.prop('disabled', true);
    gemDesc.prop('disabled', true);
    gemName.removeClass("itemEditingMode");
    gemDesc.removeClass("itemEditingMode");
    editBtn.show();
    updateBtn.hide();
    deleteBtn.hide();
    $(this).hide();
    return false;
});

$(tablesDivision).on('click', '.deleteItem', function () {

    let r = confirm("You are about to delete " + itemId + " " + gemName.val() + " Metal. Are you Sure?");
    if (r === true) {
        let data = createJsonObject(0);
        $(loading).show();
        let self = this;
        $.ajax({
            url: url + "delete",
            type: 'DELETE',
            data: data,
            contentType: 'application/json',
            success: function (result, status) {
                $(self).parent().parent().remove();
                showAlert("alert-warning", "<strong>" + name + "</strong> Metal Deleted", ".page-header");
            },
            error: function (request, status, error) {
                showAlert("alert-danger", "Error: Metal Not deleted", ".addNewItem");
                console.log("Status: " + status);
                console.log("error: " + error);
                console.log("response: " + request.responseText);
            },
            complete: function (data) {

                $(loading).hide();
            }
        });
    }

});

$('#addNewItemBtn').on('click', function () {
    let d = new Date();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let output = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + d.getFullYear();
    let r = "<tr class=\"tbl-item\" id='AddNewForm'><!--<img/>-->" + "<td class=\"td-block\" style=\"width: 100%\"><p class=\"date\">" + output + "</p>" + "<textarea id=\"newItemName\" class=\"title itemEditableFields itemTitle itemEditingMode \" placeholder='Metal Name'></textarea>" + "<textarea id=\"newItemDescription\" class=\"desc itemDesc itemEditableFields itemEditingMode\"  rows=\"10\" cols=\"80\" placeholder='Metal Description'></textarea>" + "<a class=\"addNewItem itemButtons\" href=\"#\" >Add</a>" + "<a class=\"cancelAddNewItem itemButtons\" href=\"#\" >Cancel</a>" + "</td></tr>";
    $(".demo-tbl").prepend(r);

    return false;
});

$(tablesDivision).on('click', ".cancelAddNewItem", function () {
    $(this).parent().parent().remove();
    return false;
});

$(tablesDivision).on('click', ".addNewItem", function () {
    getElements(this);
    $(loading).show();
    let data = createJsonObject(1);
    let self = this;
    $.ajax({
        url: url + "save",
        type: 'POST',
        data: data,
        contentType: 'application/json',
        success: function (result, status) {
            let currentDate = getCurrentDate();
            let r = "<tr class=\"tbl-item\" id=\""+result.metalId+"\"><td class=\"td-block\" style=\"width: 100%\"><p class=\"date\">" + currentDate + "</p><textarea  class=\"title itemEditableFields itemTitle \"  disabled>" + gemName.val() + "</textarea><textarea class=\"desc itemDesc itemEditableFields\"  rows=\"10\" cols=\"80\" disabled>" + gemDesc.val() + "</textarea><p class=\"like\" style=\"float: left\">Last updated: " + currentDate + "</p><a href=\"#\" class=\"itemButtons editItem\" >Edit</a><a class=\"updateItem itemButtons\" href=\"#\" hidden>Update</a><a class=\"cancelUpdateItem itemButtons\" href=\"#\" hidden>Cancel</a><a class=\"deleteItem itemButtons\" href=\"#\" hidden>Delete Metal</a></td></tr>";
            $(".demo-tbl").prepend(r);
            $(self).parent().parent().remove();
            showAlert("alert-success", "<strong>" + name + "</strong> Metal Added", ".page-header");
        },
        error: function (request, status, error) {
            showAlert("alert-danger", "Error: Metal Not added", ".addNewItem");
            console.log("Status: " + status);
            console.log("error: " + error);
            console.log("response: " + request.responseText);
        },
        complete: function (data) {

            $(loading).hide();
        }
    });
});

function formatDate(inputDate) {
    return new Date(inputDate).toLocaleDateString("en-US");
}

