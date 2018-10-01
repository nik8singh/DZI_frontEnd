let record;
let tableBody = ".tableBody";

function createNewRecord() {
    record = "<tr>\n" +
        "<td><i class=\"fas fa-edit editIcon\"></i></td>\n" +
        "<td><input type=\"text\" value=\"New Year\" class=\"couponText\" disabled/></td>\n" +
        "<td><input type=\"number\" value=\"20%\"  min=\"1\" max=\"20\" class=\"couponText\" disabled/></td>\n" +
        "<td><input type=\"date\" class=\"inputDate startDate\" disabled/></td>\n" +
        "<td><input type=\"date\" class=\"inputDate endDate\" disabled/></td>\n" +
        "<td><span class=\"label label-sm label-success\">Active</span></td>\n" +
        "</tr>";
}

$('#addNewRecordBtn').on('click', function () {
    let r = "<tr>\n" +
        "<td><i class=\"fas fa-edit editIcon\"></i></td>\n" +
        "<td><input type=\"text\" class=\"couponText\"/></td>\n" +
        "<td><input type=\"number\" min=\"1\" max=\"100\" class=\"couponText\"/></td>\n" +
        "<td><input type=\"date\" class=\"inputDate startDate\"/></td>\n" +
        "<td><input type=\"date\" class=\"inputDate endDate\"/></td>\n" +
        "<td><span class=\"label label-sm label-info\">Pending</span></td>\n" +
        "<td><a class=\"cancelBtn itemButtons\" href=\"#\">Cancel</a> </td>\n" +
        "</tr>";
    $(".tableBody").prepend(r);

    return false;
});

$(tableBody).on('click', ".cancelBtn", function () {
    $(this).parent().parent().remove();
    return false;
});