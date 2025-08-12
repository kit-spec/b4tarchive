define(['tracking/cookies','utilities/queryStrings','utilities/encoding'],function(Cookies,QS,Encoding) {
    var b4t_referral_cookie_name = 'b4tReferral';
    var a_query_string = 'a';
    var o_query_string = 'o';
    var t_query_string = 't';

    var check = function check() {

        var referralCookie = Cookies.get(b4t_referral_cookie_name);

        var a_query = QS.getUrlParameter(a_query_string);
        var o_query = QS.getUrlParameter(o_query_string);
        var t_query = QS.getUrlParameter(t_query_string);

        if (!referralCookie) {

            var cookie_data = {
                "affiliate_id": a_query,
                "affiliate_offer_id": o_query,
                "affiliate_transaction_id": t_query
            };

            Cookies.set(b4t_referral_cookie_name, cookie_data, 30*24);

        } else {

            referralCookie = JSON.parse(referralCookie);

            referralCookie.affiliate_id = a_query;
            referralCookie.affiliate_offer_id = o_query;
            referralCookie.affiliate_transaction_id = t_query;
            Cookies.set(b4t_referral_cookie_name, referralCookie, 30*24);

        }

        referralCookie = Cookies.get(b4t_referral_cookie_name);

    };

    check();

});
