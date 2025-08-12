define(function() {
    var cookie = {

        set : function set(cookie_name, cookie_data, expireHours) {
            var current_date = new Date();

            var cdata = cookie_data;
            var expireDate;

            expireHours = expireHours ? expireHours : 30 * 24;

            if (typeof(cookie_data) == 'object'){
                cdata = JSON.stringify(cdata);
            }

            expireDate = new Date((new Date()).setDate(current_date.getDate() + (1/24 * expireHours))).toGMTString();

            document.cookie = cookie_name + '=' + cdata + '; expires=' + expireDate;

            return this;
        },

        get : function get(cookie_name) {
            var c_start, c_end;
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(cookie_name + '=');
                if (c_start != -1) {
                    c_start = c_start + cookie_name.length + 1;
                    c_end = document.cookie.indexOf(';', c_start);
                    if (c_end == -1) {
                        c_end = document.cookie.length;
                    }

                    return document.cookie.substring(c_start, c_end);
                }
            }

            return null;
        },

        check : function check(cookie_name,cookie_data,expireHours) {
            if (!this.get(cookie_name)) {
                this.set(cookie_name,cookie_data,expireHours);
            }

            return this;
        }

    };

    return cookie;

});
