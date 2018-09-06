


$(document).ready(function(){

    $( "a.editGem" ).click(function(){

        let title = $(this).parent().find('textarea:first');
        let desc = $(this).parent().find('textarea:nth-child(3)');

        title.prop('disabled', false);
        desc.prop('disabled', false);

        title.addClass("gemEditingMode");
        desc.addClass("gemEditingMode");

        $(this).parent().find('a:nth-child(6)').show();
        $(this).parent().find('a:nth-child(7)').show();

        $(this).hide();

        return false;
    });

    $('#gemList').on('click','.updateGem',function () {
        let title = $(this).parent().find('textarea:first');
        let desc = $(this).parent().find('textarea:nth-child(3)');
        let edit = $(this).parent().find('a:first');
        let cancel = $(this).parent().find('a:nth-child(7)');
        let modifyDate = $(this).parent().find('p:nth-child(4)');

        $(this).prop('disabled', true);
        $(this).css('color','grey');
        cancel.hide();

        /*
        *
        *
        * Call backend and update database and UI
        *
        *
        *
        * */

        let r= $('<p style="color:green;font-weight:bold;float:right;">Updated Successfully</p>');
        $(this).parent().append(r);

        title.prop('disabled', true);
        desc.prop('disabled', true);

        title.removeClass("gemEditingMode");
        desc.removeClass("gemEditingMode");

        edit.show();
        $(this).hide();
        $(this).prop('disabled', false);
        $(this).css('color','darkred');

        return false;


    });

    $('#gemList').on('click','.cancelUpdateGem',function () {
        let title = $(this).parent().find('textarea:first');
        let desc = $(this).parent().find('textarea:nth-child(3)');
        let edit = $(this).parent().find('a:first');
        let update = $(this).parent().find('a:nth-child(6)');

        title.prop('disabled', true);
        desc.prop('disabled', true);

        title.removeClass("gemEditingMode");
        desc.removeClass("gemEditingMode");

        edit.show();
        update.hide();
        $(this).hide();

        return false;
    });

    $('#addNewGemBtn').on('click',function () {

        var d = new Date();

        var month = d.getMonth()+1;
        var day = d.getDate();

        var output = (month<10 ? '0' : '') + month + '/' +  (day<10 ? '0' : '') + day + '/' + d.getFullYear() ;


        var r = " <tr class=\"tbl-item\" id='AddNewForm'><!--<img/>-->" +
                " <td>Upload Image: <input type=\"file\" name=\"pic\" accept=\"image/*\" style=\"width: 180px;\"></td>" +
                " <td class=\"td-block\">\n" +
                " <p class=\"date\" id=\"gemCreatedDate001\">"+output+"</p>" +
                " <textarea  class=\"title gemEditableFields gemTitle gemEditingMode \" placeholder='Gemstone Name'></textarea>" +
                " <textarea class=\"desc gemDesc gemEditableFields gemEditingMode\"  rows=\"10\" cols=\"80\" placeholder='Gemstone Description'></textarea>" +
                " <a class=\"addNewGem gemButtons\" href=\"#\" >Add</a>" +
                " <a class=\"cancelAddNewGem gemButtons\" href=\"#\" >Cancel</a>" +
                " </td> </tr>";

        $(".demo-tbl").prepend(r);
    });

    $('#gemList').on('click',".cancelAddNewGem",function () {

        $(this).parent().parent().remove();
    });



});
