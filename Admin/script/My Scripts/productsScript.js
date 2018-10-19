const url = "http://localhost:8080/product/";
let loading = "#loading";
let c;
let tableBody = ".tableBody";

$(window).on('load', function () {

    let myObject = {

        productId: 11,

    };


    let data = JSON.stringify(myObject);

    // $.support.cors = true;
    $.ajax({
        url: url + "delete",
        type: 'DELETE',
        data: data,
        contentType: 'application/json',
        success: function (result) {
            console.log("hello");
        },
        complete: function (data) {
            $.ajax({
                url: url + "all",
                type: 'GET',
                dataType: 'json',
                success: function (result) {
                    let aa = 1;
                    $.each(result, function (index, element) {
                        let a = element.createdDate;
                        let b = element.updatedDate;
                        c = element.productId;
                        let d = element.productName;
                        let e = element.productDescription;
                        let f = element.productweight;
                        let g = element.weightUnit;
                        let h = element.productPrice;
                        let i = element.productCurrency;
                        let j = element.productSku;
                        let k = element.productQuantity;
                        let l = element.productQuantityType;
                        let m = element.productOnFeatured;
                        let n = element.productPublished;
                        let o = element.productExpense;
                        let a1 = element.productJewelryType.jewelryTypeId;
                        let a2 = element.productJewelryType.jewelryTypeName;
                        let a3 = element.productJewelryType.jewelryTypeDescription;
                        let a4 = element.productJewelryType.createdDate;
                        let a5 = element.productJewelryType.updatedDate;

                        $("#tab-general").append("<br> " + a + "<br> " + b + "<br> " + c + " <br>" + d + " <br>" + e + " <br>" + f + " <br>" + g + " <br>" + h + " <br>" + i + "<br> " + j + "<br> " + k + "<br> " + l + " <br>" + m + " <br>" + n + "<br> " + o);
                        $("#tab-general").append("<br><br> " + a1 + "<br> " + a2 + " <br>" + a3 + "<br> " + a4 + "<br> " + a5);
                        $("#tab-general").append("<br><hr><br>");

                    });
                },
                error: function (request, status, error) {
                    console.log("Status: " + status);
                    console.log("error: " + error);
                    console.log("json not found: " + request.responseText);
                },
                complete: function (data) {
                    $("#activePageCrumb").text("Products");
                    $('#pageTitle').text("Products");
                    $('#menu_product').addClass("active");

                    $(loading).hide();

                }
            });

        }
    });


});

function showAlert(alertType, message, elementClass) {

    let done = "<div class=\"alert " + alertType + " \">" + "<button type=\"button\" data-dismiss=\"alert\" aria-hidden=\"true\" class=\"close\">&times;</button>" + message + "</div>";
    $(elementClass).parent().append(done);
}

let originalName, originalDescription, originalAddName, originalAddLineOne, originalAddLineTwo, originalAddCity,
    originalAddState, originalAddZipcode, originalCountry, originalBoothNumber;
