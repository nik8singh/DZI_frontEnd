/**
 * Created by Nikhil Singh on 1/16/2016.
 */

    $('.carousel').carousel({
        interval: 3000
    });

$('body').on({
    click: function() {
        $('html, body').animate({
            scrollTop: $("#bigCallout").offset().top
        }, 1000);
    }
},'#signInNav');
