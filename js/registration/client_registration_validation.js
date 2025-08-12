define(['lodash', 'registration_regex'], function(_, registrationRegex) {
    // Sanitize Input
    var sanitizeInput = function sanitizeInput(value_to_sanitize, regex_to_sanitize, onSanitize) {
        var sanitizated_input = value_to_sanitize.replace(regex_to_sanitize, '');
        if(value_to_sanitize !== sanitizated_input) {
            if(_.isFunction(onSanitize)) {
                onSanitize();
            }
        }
        return sanitizated_input;
    };

    //--------------------------------------------------------------------------
    // Company name
    //--------------------------------------------------------------------------
    var isCompanyNameValid = function isCompanyNameValid(company_name) {

        company_name = company_name || '';

        if(company_name.length < 41) {
            return true;
        } else {
            return false;
        }
    };
    //--------------------------------------------------------------------------
    // Secure URL
    //--------------------------------------------------------------------------
    var isSecureURLValid = function isSecureURLValid(secure_url) {
        if((secure_url.match(registrationRegex.secure_url_regex) !== null && secure_url.match(registrationRegex.secure_url_regex)[0].length === secure_url.length) && secure_url.length > 3 && secure_url.length < 16) {
            return true;
        } else {
            return false;
        }
    };
    //--------------------------------------------------------------------------
    // Email
    //--------------------------------------------------------------------------
    var isEmailValid = function(email) {
        return registrationRegex.email_regex.test(email);
    };

    var isEDUEmail = function(email) {
        return email.substr(email.length - 3).toLocaleLowerCase() === 'edu';
    };

    //--------------------------------------------------------------------------
    // Phone Number
    //--------------------------------------------------------------------------
    var isPhoneValid = function isCompanyNameValid(phoneNumber,requirePhone) {

        phoneNumber = phoneNumber || '';

        if((phoneNumber.length >= 7 && phoneNumber.length < 20) || requirePhone !== true) {
            return true;
        } else {
            return false;
        }

    };


    //--------------------------------------------------------------------------
    // Confirm Password
    //--------------------------------------------------------------------------
    var arePasswordsValid = function arePasswordsValid(password, confirm_password) {
        if( //(password === '' && confirm_password === '') ||
            (password === confirm_password) && (password.length > 7) && (password.length < 51) && (confirm_password.length > 7) && (confirm_password.length < 51)) {
            return true;
        } else {
            return false;
        }
    };
    //--------------------------------------------------------------------------
    // Validation Logic
    //--------------------------------------------------------------------------
    var validateFormValues = function validateFormValues(values,requirePhone) {
        return {
            company_name: isCompanyNameValid(values.company_name),
            secure_url: isSecureURLValid(values.secure_url),
            email: isEmailValid(values.email),
            phone: isPhoneValid(values.phone,requirePhone),
            //email: true,
            password: arePasswordsValid(values.password, values.confirm_password),
            confirm_password: arePasswordsValid(values.password, values.confirm_password),
            plan_type: (values.plan_type != 'undefined' && values.plan_type !== null) ? true : false,
            receive_email: true, // always true because it doesn't matter 
            terms_of_service: values.terms_of_service
        };
    };

    return {
        isCompanyNameValid: isCompanyNameValid,
        isSecureURLValid: isSecureURLValid,
        isEmailValid: isEmailValid,
        isPhoneValid: isPhoneValid,
        arePasswordsValid: arePasswordsValid,
        validateFormValues: validateFormValues,
        sanitizeInput: sanitizeInput,
        isEDUEmail: isEDUEmail
    };
});
