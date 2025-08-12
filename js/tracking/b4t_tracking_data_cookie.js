define(['tracking/cookies','utilities/queryStrings','utilities/encoding'],function(Cookies,QS,Encoding) {
    var default_cookie_name = 'b4tTrackingData';

    var check = function check() {

        var curCookie = Cookies.get(default_cookie_name);
        var ref;

        ref = QS.getUrlParameter('ref');

        if(ref){
            try {
                ref = JSON.parse(Encoding.hexDecode(ref));
            }catch(ex){
                ref =  {f: null, u: null};
            }
        }else{
            ref = {f: null, u: null};
        }

        if(!curCookie) {

            var cookie_data = {
                date: new Date(),
                landing: document.URL,
                referral: document.referrer,
                path: '/',
                referralFirm: ref.f,
                referralUser: ref.u,
                gaClientId: document.cookie.match(/_ga=(.+?);/)[1].split('.').slice(-2).join(".")//get ga client id from cookie
            };

            Cookies.set(default_cookie_name,cookie_data,30*24);

        }else{

            curCookie = JSON.parse(curCookie);

            if(curCookie.referralFirm == null) {
                curCookie.referralFirm = ref.f;
                curCookie.referralUser = ref.u;
                Cookies.set(default_cookie_name,curCookie,30*24);
            }

        }

        curCookie = Cookies.get(default_cookie_name);

    };

    check();

});
