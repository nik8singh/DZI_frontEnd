/**
 * Created by Nikhil Singh on 2/11/2016.
 * This JavaScript file is for -
 */
var searchedProduct = null, productId = null, imgLoc;

$(document).ready(function () {

    searchedProduct = localStorage.getItem('item_name');
    $('#productName').text(searchedProduct);
    $('#productType').text(localStorage.getItem('item_type'));
    $('#productHeading').text(searchedProduct);
    productId = localStorage.getItem('item_id');
    info.getData();

});

$("body").on('click', '.images', function () {
    $('.images').removeClass('selectedImg');
    $(this).addClass('selectedImg');
    imgLoc = $(this).attr('src');
    $('#mainImg').attr("src", imgLoc);
    $('.zoom').zoom({url: imgLoc, magnify: 1.5});
});
//$('#productsBtn').on('shown.bs.dropdown', fu

var info = {
    baseUrl: "https:/192.168.0.48:8443/bloom/",
    getData: function () {
        this.customAjaxRequest("https://192.168.0.48:8443/bloom/rest/item/" + productId, "GET", this);
    },

    customAjaxRequest: function (url, typeOfReq, scope) {

        $.ajax({

            url: url,
            method: typeOfReq,
            contentType: "application/json",
            crossDomain: true,
            dataType: 'json',
            success: function (data) {
                scope.fillPage(data.payload.items.item);
                console.log("success")
            },
            error: function (obj1, obj2, obj3) {

            },
            callback: function () {

            }
        });

    },

    fillPage: function (item) {
        this.getImage(item);
        $('.zoom').zoom();
        $('#price').text("$"+item.item_price);
        $('#productDesc').text(item.item_description);
        //$('#base').text(item.gemstone);
        //$('#dimensions').text(item.gemstone);
        $('#weight').text(item.weight + " "+item.weighted_unit);
        $('#origin').text(item.item_origin);
    },

    getImage: function (item) {

        console.log(item);
        var priority = 0;
        var productImgLoc;

        if (item.image_count == 1) {
            productImgLoc = item.item_images.item_image.image_location;
            this.addImage(this.baseUrl + productImgLoc, 1);
        }
        else if (item.image_count > 1) {
            for (var loc = 0, searchPriorityNum = 1; searchPriorityNum <= item.image_count; loc++) {

                priority = item.item_images.item_image[loc].image_priority;

                if (priority == searchPriorityNum) {
                    productImgLoc = item.item_images.item_image[loc].image_location;
                    this.addImage(this.baseUrl + productImgLoc, priority);
                    loc = 0;
                    searchPriorityNum++;
                }
            }
        }
    },

    addImage: function (ImgSrc, priority) {
        if (priority == 1) {
            $("#imgThumbnail").append('<div><img src="' + ImgSrc + '" alt="product image"' +
                'class="img-thumbnail ProductImageClass productImgList selectedImg images pull-left"> </div>');
            $('#mainImg').attr("src", ImgSrc);
        } else {
            $("#imgThumbnail").append('<div><img src="' + ImgSrc + '" alt="product image"' +
                'class="img-thumbnail ProductImageClass productImgList  images pull-left"> </div>');
        }
    }

};