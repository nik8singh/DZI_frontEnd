/**
 * Created by Nikhil Singh on 1/9/2016.
 *
 */
var searchedType = "", gemstone = [], gemstoneString = "", sortOrder = "";
var baseUrl= "https:/localhost:8443/bloom/";

$(document).ready(function () {
    searchedType = localStorage.getItem('item_type');
    $('#productType').text(searchedType);
    $('.typeHeading').text(searchedType.toUpperCase());

    gems.getGems();
    list.getList();
    tabActive.changeActive();
});

var tabActive={
    changeActive: function (){
        $('#productTab').addClass('activeTab');
    }

};
var gems ={
    getGems: function(){

        this.customAjaxRequest(baseUrl+"rest/gemstones", "GET",this);
    },
    customAjaxRequest: function (url, typeOfReq,scope) {
        $.ajax({

            url: url,
            method: typeOfReq,
            contentType: "application/json",
            crossDomain: true,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                scope.fillGemstoneList(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                //alert("XMLHttpRequest: "+xhr.responseText +"\n  textStatus: "+textStatus+"\n errorThrown: "+errorThrown);
                console.log("error", xhr, textStatus, errorThrown);

            },
            callback: function () {

            }
        });
    },
    fillGemstoneList: function (data) {
        var itemCount = data.payload.gemstone_count;
        if (itemCount > 0) {
            var items = data.payload.gemstones.gemstone;

            for (var i = 0; i < itemCount; i++) {

                var gemstoneData = itemCount == 1 ? items : items[i];

                $("#gemstoneCheckboxes").append(' <div class="checkbox ">'+
                    '<input type="checkbox" id="checkbox'+(i+1)+'"' +
                    ' value="'+gemstoneData.gemstone_name.toUpperCase()+'" class="check">'+
                    '<label for="checkbox'+(i+1)+'">'+gemstoneData.gemstone_name.toUpperCase()+'</label>'+
                    '</div> <br>');
            }
        }
    }
};

$( "#gemstoneCheckboxes" ).on('click', 'input[id^="checkbox"]', function(){
    //console.log("checked",$(this).val());
    if (this.checked)
        gemstone.push($(this).val().toLowerCase());
    else
        gemstone.splice(gemstone.indexOf($(this).val()), 1);
    arrayToString();
});


$('.sortBtn').click(function () {
    if ($(this).text() == "Price low to high") {
        sortOrder = "ASC";
    } else if ($(this).text() == "Price high to low") {
        sortOrder = "DESC";
    } else {
        sortOrder = "";
    }
    list.getList();
});

function arrayToString() {

    gemstoneString = [];
    for (var i = 0; i < gemstone.length; i++) {
        gemstoneString += gemstone[i];
        if (i < (gemstone.length - 1))
            gemstoneString += ',';
    }
    list.getList();
}

var list = {

    getList: function () {
        var data = {
            filter: {
                params: ["item_type=" + searchedType, "gemstone_name=" + gemstoneString]
            },
            sort: {
                params: ["item_price=" + sortOrder]
            }
        };

        this.customAjaxRequest(baseUrl+"rest/items/customFilter", JSON.stringify(data), "POST", this);
    },

    customAjaxRequest: function (url, data, typeOfReq, scope) {
        console.log(typeOfReq);
        $.ajax({

            url: url,
            data: data != null ? data : null,
            method: typeOfReq,
            contentType: "application/json",
            crossDomain: true,
            dataType: 'json',
            success: function (data) {
                console.log(data);
                scope.fillList(data);
            },
            error: function (xhr, textStatus, errorThrown) {
                //alert("XMLHttpRequest: "+xhr.responseText +"\n  textStatus: "+textStatus+"\n errorThrown: "+errorThrown);
                console.log("error", xhr, textStatus, errorThrown);


            },
            callback: function () {

            }
        });

    },


    fillList: function (data) {

        $("#features").empty();
        var itemCount = data.payload.item_count;
        if (itemCount > 0) {
            var items = data.payload.items.item;
            var imgLoc;

            for (var i = 0; i < itemCount; i++) {

                var filteredItem = itemCount == 1 ? items : items[i];
                imgLoc = this.getImage(filteredItem);

                $("#features").append('<div class="col-sm-4 feature thumbnail" >' +
                    '<div class="panel"> <div class="imgDiv">' +
                    '<img id="product' + (i + 1) + 'Image" src="' + baseUrl + imgLoc + '" alt="product ' + (i + 1)
                    + ' image" class="img-rounded ProductImageClass"> </div>' +
                    '<p class="productName" id=' + filteredItem.item_id + '> ' + filteredItem.item_name + '</p> </div>' +
                    '<div class="label label-success price"><span class="glyphicon glyphicon-tag"></span>' +
                    '<sup>$</sup>' + filteredItem.item_price + ' </div></div>');
            }
        }

    },

    getImage: function (item) {

        var productImgLoc;
        if (item.image_count == 1) {
            productImgLoc = item.item_images.item_image.image_location;
            return productImgLoc;
        }
        else if (item.image_count > 1) {
            for (var i = 0; i < item.image_count; i++)
                if (item.item_images.item_image[i].image_priority == 1)
                    productImgLoc = item.item_images.item_image[0].image_location;
            return productImgLoc;
        }
        return "";
    }

};
