// Configures modules to associate with require

window.onerror = function(msg, url, line, col, error) {

      console.log('msg:' + msg,'url' + url,'line' + line,'col' + col,'error' + error);

};

var module_paths = {
   // 'adroll': 'tracking/adroll',
    'b4t_referral_cookie': 'tracking/b4t_referral_cookie',
    'b4t_tracking_data_cookie': 'tracking/b4t_tracking_data_cookie',
    'bootstrap': '/js/third_party/bootstrap.min',
    'header_logic': 'header_logic/header_logic',
    'incentive_logic': 'time_tracking_incentives/time_tracking_incentives',
    'jquery': 'third_party/jquery-1.11.2.min',
    'jqueryUI': 'third_party/jquery-ui-1.11.4/jquery-ui.min',
    'lodash': 'third_party/lodash_3.3.1',
    'module_loader': 'b4t_module_loader',
    'registration_logic': 'registration/client_registration_logic',
    'registration_logic2': 'registration/client_registration_logic2',
    'registration_regex': 'registration/client_registration_regex',
    'registration_model': 'registration/client_registration_model',
    'registration_validation': 'registration/client_registration_validation',
    // 'zenbox_loader': 'zendesk/zenbox',
    'leftNavMenu': 'leftNavMenu/menuHelpers',
    'bill4time-insiders-client': '/js/promo/bill4time-insiders-client',
    'mixpanel': 'third_party/mixpanel-bundle',
    'drift' : '/js/drift/drift'
};

// Configures the require library
require.config({
    baseurl: 'js',
    paths: module_paths,
    shim: {
        'bootstrap': {
            deps: []
        },
        'header_logic': {
            deps: []
        },
        'jqueryUI': {
            deps: []
        },
        'registration_logic': {
            deps: ['registration_validation', 'registration_regex']
        },
        'registration_logic2': {
            deps: ['registration_validation', 'registration_regex']
        },
        'mixpanel': {
            deps: []
          }
    }
});

// These are the globally required modules for EVERY page loaded
var required_modules = [
    //'adroll',
    'b4t_referral_cookie',
    'b4t_tracking_data_cookie',
    'bootstrap',
    'header_logic',
    //'jquery',
    //'jqueryUI',
    'lodash',
    'module_loader',
    'leftNavMenu',
    'drift',
    'mixpanel'
];


// HEADER BUTTON FLICKER / DELAY COLOR CHANGE //

        function specialStartupStuff(){
            // $(".btn-homepage").filter(".btn-homepage[id!='check-btn']").css({"background-color":"#12d953"});

        }





 $(function(){

    require(required_modules, function() {
        // console.log('Module Loader has been loaded.');
        //Delay the zenbox load, as it is slowing down a lot of other loading
//        setTimeout(function() {
//            require(['zenbox_loader']);
//        }, 100);
   });

    specialStartupStuff();

});

