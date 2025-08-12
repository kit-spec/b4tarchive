define([], function() {
    var secure_url_regex = new RegExp('[A-Za-z0-9_-]+', 'gi');
    var email_regex = new RegExp('^\\S+@\\S+\\.\\S+$');

    return {
        secure_url_regex: secure_url_regex,
        email_regex: email_regex
    };
});
