
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

function signOut() {
    $('#signInNav').css("display","block");

    var auth2 = gapi.auth2.getAuthInstance();

    auth2.signOut().then(function () {
        console.log('User signed out.');
    });


    var $alert = $("#alert");
    $alert.text("Sign out successful");
    setTimeout(function() {
        $alert.text("");
     }, 3000);

    window.location.reload(true);
}

function onSignIn(googleUser) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);

    $('#signupModal').modal('toggle');
    $('#signInNav').css("display","none");
    var $alert = $("#alert");
    $alert.text("Sign In successful");

    setTimeout(function() {
        $alert.text("");
    }, 3000);
}
