define(function() {
    //set the current active left nav menu based on the value of B4TCurrentLeftNav
    $(function() {
        if(window.B4TCurrentLeftNav && window.B4TCurrentLeftNav.length > 0) {
            $('li #' + window.B4TCurrentLeftNav).addClass('current');
        }
    });
});
