
//exit button on terms of use div
$(".termsLink").on('click', function () {
    $(".TermsText").load("../terms.html");
});

$(window).load(function () {
    $('#foot').load('footer.html');
    console.log(localStorage.getItem('tab_open'));
    $('#navigation').load('header.html',{},function(){$("#"+localStorage.getItem('tab_open')).addClass('activeTab');});

});

$(".goingHome").click(function(){
    $(localStorage.getItem('tab_open')).removeClass('activeTab');
    localStorage.setItem('tab_open','homeBtn');
    window.location.href="index.html";
});

$('.navProducts').click(function(){
    console.log($(this).attr('id'));
    localStorage.setItem('item_type', $(this).attr('id'));
    $(localStorage.getItem('tab_open')).removeClass('activeTab');
    localStorage.setItem('tab_open','productTab');
    window.location.href="productList.html";
});

$( "body" ).on('click', '.feature', function(){
    localStorage.setItem("item_id",$(this).find('p').attr('id'));
    localStorage.setItem("item_name",$(this).find('p').text());
    window.location.href="productPage.html";
});

