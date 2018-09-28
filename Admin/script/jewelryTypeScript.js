const url = "http://localhost:8080/jewelry_type/";
// const  url = "https://jsonplaceholder.typicode.com/todos/1";
$(function() {
    console.log("fetching Jewelry Types from: " + url);
    $.ajax({
        url: url+"all",
        type: 'GET',
        dataType: 'json',
        success: function(result) {
            let i = 0;
            $.each(result, function(index, element) {
                console.log("jewelryTypeName: " + element.jewelryTypeName);
                let updatedDate = formatDate(element.updatedDate);
                let createdDate = formatDate(element.createdDate);
                if (i > 0) {
                    let r = "<tr class=\"tbl-item\">" + "<td class=\"img\"><img src=\"../images/thumbs/arch-1.jpg\" alt=\"\" title=\"\"/></td><td class=\"td-block\">" + "<p class=\"date\">" + createdDate + "</p>" + "<textarea  class=\"title typeEditableFields typeTitle \"  disabled>" + element.jewelryTypeName + "</textarea>" + "<textarea class=\"desc typeDesc typeEditableFields\"  rows=\"10\" cols=\"80\" disabled>" + element.jewelryTypeDescription + "</textarea>" + "<p class=\"like\" style=\"float: left\"> Last Updated: " + updatedDate + "</p>" + "<a href=\"#\" class=\"typeButtons editType\" >Edit</a>" + "<a class=\"updateType typeButtons\" href=\"#\" hidden>Update</a>" + "<a class=\"cancelupdateType typeButtons\" href=\"#\" hidden>Cancel</a>" + "<a class=\"deleteType typeButtons\" href=\"#\" hidden>Delete Jewelry Type</a>" + "</td></tr>";
                    $(".demo-tbl").prepend(r);
                } else {
                    $('.typeThumbnail').attr("src","../images/thumbs/arch-1.jpg");
                    $('.typeCreatedDate').text(createdDate);
                    $('.typeUpdatedDate').text("Last Updated: " + updatedDate);
                    $('.typeTitle').text(element.jewelryTypeName);
                    $('.typeDesc').text(element.jewelryTypeDescription);
                    $('.editType').show();
                }
                i++;
            });
        },
        error: function(request, status, error) {
            console.log("Status: " + status);
            console.log("error: " + error);
            console.log("json not found: " + request.responseText);
        }
    });
});
let editingTitle;
let editingDesc;
$('#typeList').on('click', '.editType', function() {
    let title = $(this).parent().find('textarea:first');
    let desc = $(this).parent().find('textarea:nth-child(3)');
    editingTitle = title.val();
    editingDesc = desc.val();
    title.prop('disabled', false);
    desc.prop('disabled', false);
    title.addClass("gemEditingMode");
    desc.addClass("gemEditingMode");
    $(this).parent().find('a:nth-child(6)').show();
    $(this).parent().find('a:nth-child(7)').show();
    $(this).parent().find('a:nth-child(8)').show();
    $(this).hide();
    return false;
});
$('#typeList').on('click', '.updateType', function() {
    let title = $(this).parent().find('textarea:first');
    let desc = $(this).parent().find('textarea:nth-child(3)');
    let edit = $(this).parent().find('a:first');
    let cancel = $(this).parent().find('a:nth-child(7)');
    let deleteBtn = $(this).parent().find('a:nth-child(8)');
    let modifyDate = $(this).parent().find('p:nth-child(4)');

    $(this).prop('disabled', true);
    $(this).css('color', 'grey');
    cancel.hide();

    /*
     *
     *
     *
     *
     * update database and UI
     *
     *
     *
     * */

    title.prop('disabled', true);
    desc.prop('disabled', true);
    title.removeClass("gemEditingMode");
    desc.removeClass("gemEditingMode");
    edit.show();
    $(this).hide();
    $(this).prop('disabled', false);
    $(this).css('color', 'darkred');
    deleteBtn.hide();
    let r = "<div class=\"alert alert-success alert-dismissable\"><strong>Updated!</strong> Successfully.</div>";
    $(this).parent().append(r);
    return false;
});
$('#typeList').on('click', '.cancelUpdateType', function() {
    let title = $(this).parent().find('textarea:first');
    let desc = $(this).parent().find('textarea:nth-child(3)');
    let edit = $(this).parent().find('a:first');
    let update = $(this).parent().find('a:nth-child(6)');
    let deleteType = $(this).parent().find('a:nth-child(8)');
    title.val(editingTitle);
    desc.val(editingDesc);
    title.prop('disabled', true);
    desc.prop('disabled', true);
    title.removeClass("gemEditingMode");
    desc.removeClass("gemEditingMode");
    edit.show();
    update.hide();
    deleteType.hide();
    $(this).hide();
    return false;
});
$('#typeList').on('click', '.deleteType', function() {
    let title = $(this).parent().find('textarea:first');
    let desc = $(this).parent().find('textarea:nth-child(3)');
    let name = title.val();
    let r = confirm("You are about to delete "+name+" Jewelry Type. Are you Sure?");
    if (r == true) {



        /*
         *
         *
         *
         *
         * Delete from database
         *
         *
         *
         *
         * */

        $(this).parent().parent().remove();
        let done = "<div class=\"alert alert-warning alert-dismissable\">" + "<button type=\"button\" data-dismiss=\"alert\" aria-hidden=\"true\" class=\"close\">&times;</button>" + "<strong>" + name + "</strong> Jewelry Type Deleted" + " </div>";
        $('.page-header').append(done);
    }


    return false;
});
$('#addNewTypeBtn').on('click', function() {
    let d = new Date();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let output = (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + '/' + d.getFullYear();
    let r = "<tr class=\"tbl-item\" id='AddNewForm'><!--<img/>-->" + "<td>Upload Image: <input type=\"file\" name=\"pic\" accept=\"image/*\" style=\"width:180px;\"></td>" + "<td class=\"td-block\"><p class=\"date\">" + output + "</p>" + "<textarea id=\"newTypeName\" class=\"title typeEditableFields typeTitle typeEditingMode \" placeholder='Jewelry Type Name'></textarea>" + "<textarea id=\"newGemDescription\" class=\"desc typeDesc typeEditableFields TypeEditingMode\"  rows=\"10\" cols=\"80\" placeholder='Jewelry Type Description'></textarea>" + "<a class=\"addNewtype typeButtons\" href=\"#\" >Add</a>" + "<a class=\"cancelAddNewType typeButtons\" href=\"#\" >Cancel</a>" + "</td></tr>";
    $(".demo-tbl").prepend(r);
});
$('#typeList').on('click', ".cancelAddNewType", function() {
    $(this).parent().parent().remove();/lp
});
$('#typeList').on('click', ".addNewType", function() {
    let name = $('#newTypeName').val();
    let desc = $('#newTypeDescription').val();
    let image = "../images/thumbs/arch-1.jpg";

    let myValues = {jewelryTypeName: name, jewelryTypeDescription: desc};

    $.ajax({
        url: url+"add",
        type: 'POST',
        data: myValues,
        success: function(result) {
            alert("success: " + result.toString());

            let createdDate = "1/1/1888";
            let lastUpdatedDate = "Last Modified 1/1/1888";
            let r = "<tr class=\"tbl-item\"><td class=\"img\"><img src=" + image + " alt=\"\" title=\"\"/></td><td class=\"td-block\"><p class=\"date\">" + createdDate + "</p><textarea  class=\"title typeEditableFields typeTitle \"  disabled>" + name + "</textarea><textarea class=\"desc typeDesc typeEditableFields\"  rows=\"10\" cols=\"80\" disabled>" + desc + "</textarea><p class=\"like\" style=\"float: left\">Last updated: " + lastUpdatedDate + "</p><a href=\"#\" class=\"typeButtons editType\" >Edit</a><a class=\"updateType typeButtons\" href=\"#\" hidden>Update</a><a class=\"cancelUpdateType typeButtons\" href=\"#\" hidden>Cancel</a><a class=\"deleteType typeButtons\" href=\"#\" hidden>Delete Jewelry Type</a></td></tr>";
            $(this).parent().parent().remove();
            $(".demo-tbl").prepend(r);

        },
        error: function(request, status, error) {
            let done = "<div class=\"alert alert alert-danger alert-dismissable\">" + "<button type=\"button\" data-dismiss=\"alert\" aria-hidden=\"true\" class=\"close\">&times;</button>" + "<strong>" + name + "</strong> Error Jewelry Type Not added" + " </div>";
            $('.addNewType').parent().append(done);

            console.log("Status: " + status);
            console.log("error: " + error);
            console.log("response: " + request.responseText);
        }
    });
    /*
     *
     *
     *
     * Add to Database
     *
     *
     *
     */

});

function formatDate(inputDate) {
    return new Date(inputDate).toLocaleDateString("en-US");
}