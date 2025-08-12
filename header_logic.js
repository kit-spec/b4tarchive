/**
 * [toggleHeaderElement assumes you are passing in a string that points to the correct selecter, whether it's an id or class]
 * @param  { string } dom_element [ a string that is the name of the selector being used]
 * @return {undefined}             [description]
 */
define(['bootstrap'], function() {
    window.toggleHeaderElement = function toggleHeaderElement(dom_id) {
        var shrink_class = 'shrink-icon';
        var unshrink_class = 'unshrink-icon';
        var selected_drawer = $('#' + dom_id);
        var was_already_showing = $('#' + dom_id).hasClass('show-drawer');
        var jquery_head_icon = $('.header-icon');
        var subnav_id;

        var nav_ids = [
            'subnav-business-types',
            'subnav-features',
            'subnav-pricing',
            'subnav-account',
        ];
        for(var i = 0; i < nav_ids.length; i++) {
            subnav_id = $('#' + nav_ids[i]);
            if(subnav_id.hasClass('show-drawer')) {
                subnav_id.removeClass('show-drawer');
                subnav_id.addClass('hide-drawer');
            }
        }

        jquery_head_icon.removeClass(shrink_class);
        jquery_head_icon.addClass(unshrink_class);
        if(!was_already_showing) {
            console.log(selected_drawer);
            // console.log('was not already showing!!!!');
            selected_drawer.addClass('show-drawer');
            selected_drawer.removeClass('hide-drawer');

            if(selected_drawer.hasClass('collapse')) {
                selected_drawer.removeClass('collapse');
            }

            if(!jquery_head_icon.hasClass(shrink_class)) {
                jquery_head_icon.addClass(shrink_class);
            }
            if(jquery_head_icon.hasClass(unshrink_class)) {
                jquery_head_icon.removeClass(unshrink_class);
            }

            // Handles resizing of the background image so it doesn't look dumb
            var hero_image_selector = 'hero-image';
            var hero_image_jquery_object = $('.' + hero_image_selector);
            var hero_image_small_expand_class = 'small-expand';
            var hero_image_large_expand_class = 'large-expand';
            hero_image_jquery_object.removeClass(hero_image_small_expand_class);
            hero_image_jquery_object.removeClass(hero_image_large_expand_class);
            if(selected_drawer.hasClass('small')) {
                hero_image_jquery_object.addClass(hero_image_small_expand_class);
                console.log('adding small');
            } else if(selected_drawer.hasClass('large')) {
                hero_image_jquery_object.addClass(hero_image_large_expand_class);
                console.log('adding large');
            } else {
                // do nothing
            }
        }
    };

    /** Mouse over -activates Bootstrap "tool tips"  */
    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });

    /** Mouse over -activates Bootstrap "Pop-overs"  */
    $(function() {
        $('[data-toggle="popover"]').popover({
            trigger: 'hover focus' /*delay:{show:200,hide:75}}*/
        });



        //*** MODAL  Button **//
        $(document).ready(function() {

// Gets the video src from the data-src on each button
            var $videoSrc;
            $('.video-btn').click(function() {
                $videoSrc = $(this).data( "src" );
            });

            // console.log($videoSrc);

// when the modal is opened autoplay it
            $('#myModal').on('shown.bs.modal', function (e) {

// set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
                $("#myModal iframe").attr('src',$videoSrc + "?rel=0&amp;controls=0&amp;showinfo=0&amp;modestbranding=0&amp;autoplay=1" );
            });

// stop playing the youtube video when I close the modal
            $("#myModal").on('hidden.bs.modal', function (e) {
                $("#myModal iframe").attr('src',$videoSrc + "?rel=0&amp;controls=0&amp;showinfo=0&amp;modestbranding=0&amp;autoplay=0" );
            });
        });

        // //*** Removes Youtube Logo from iFrame video **//
        // var head = jQuery("#iframe").contents().find("head");
        // var css = '<style type="text/css">' +
        //     '#banner{display:none}; ' +
        //     '</style>';
        // jQuery(head).append(css);


    });
});

