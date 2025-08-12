/**
 * Created by Jeremy on 4/4/2018.
 */
define(function() {

    return {
        hexEncode : function(str){
            var hex, i;

            var result = "";
            for (i=0; i<str.length; i++) {
                hex = str.charCodeAt(i).toString(16);
                result += hex;
            }

            return result;
        },
        hexDecode : function(hex){
            hex = hex.toString();//force conversion
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return str;
        }
    };

});
