/* global grecaptcha */

define(['lodash', 'registration_model', 'registration_validation'], function(_, registrationModel, registrationValidation) {
    // window.registration_data = window.registration_data || registrationModel;

    // Totally ripped off from here
    // http://www.bloggingdeveloper.com/post/JavaScript-QueryString-ParseGet-QueryString-with-Client-Side-JavaScript.aspx
    function getQueryString(key, default_) {
        if (default_ == null) {
            default_ = '';
        }
        key = key.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
        var qs = regex.exec(window.location.href);
        if (qs == null) {
            return default_;
        } else {
            return decodeURIComponent(qs[1]);
        }
    }

    function isStringInArray(string, array) {
        // This is not compatible with < IE9 apparently...
        // var string_is_in_array = (array.indexOf(string, array) > -1) ? true : false;
        // This is compatible
        var string_is_in_array = ($.inArray(string, array) > -1) ? true : false;
        return string_is_in_array;
    }

    function togglePrice(containing_dom_class, plan_type) {
        var containing_dom_element = ('.' + containing_dom_class);
        registrationModel.current_selected_plan = plan_type;

        $(containing_dom_element).removeClass('hidden').show();
        // Hides ALL the snippets
        var all_snippets = containing_dom_element + ' .snippet';
        var snippet_to_show = containing_dom_element + ' .' + registrationModel.getPlanType().snippet;
        $(all_snippets).hide();
        $(snippet_to_show).show();

        // Deselects all the selected plans, and selects the correct one
        // This isn't stellar as it's really tightly coupled with the containing div
        var selected_plan_element_selector = containing_dom_element + ' .plan-container' + ('.' + plan_type);
        $(containing_dom_element + ' .plan-container').removeClass('selected');
        $(selected_plan_element_selector).addClass('selected');
    }

    function configureRegistrationForm(registration_container_dom_id) {
        // TODO: These should really be converted to class selectors, but I'm not
        //  sure what that would do in terms of functionality
        var jquery_registration_container_dom_id = '.' + registration_container_dom_id;

        // Error message containers
        var $emailExistsError = $(jquery_registration_container_dom_id + ' #emailExistsError');
        var $invalidEmailError = $(jquery_registration_container_dom_id + ' #invalidEmailError');
        var $invalidEduEmailError = $(jquery_registration_container_dom_id + ' #invalidEduEmailError');
        var $serverError = $(jquery_registration_container_dom_id + ' #serverError');

        var emailErrorInputClass = 'error';

        // Input fields
        var $email_input = $(jquery_registration_container_dom_id + ' #inputEmail1');

        // Action buttons
        var $submit_button = $(jquery_registration_container_dom_id + ' #emailSubmit');

        // Manual form_submit event push
        if ($submit_button.length) {
            $submit_button.on('click', function () {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: "form_submit",
                    formId: registration_container_dom_id,
                    email: $email_input.val()
                });
                console.log("form_submit event pushed to dataLayer");
            });
        }

        var $forceCreateAccountButton = $(jquery_registration_container_dom_id + ' #createAnotherAccount');

        var signupEmail = getQueryString('email');

        var $gaTrackingData = $('#GA_Tracking_Data');

        //if an email is sent in to the registration form, auto-populate it on the form
        if(signupEmail !== ''){
            $email_input.val(signupEmail);
        }

        //--------------------------------------------------------------------------
        // Email
        //--------------------------------------------------------------------------
        var emailShowError = function emailShowError() {
            $email_input.val(registrationValidation.sanitizeInput($email_input.val(), /\s+/gi));

            var isStudentPlan = $('.registration.student').length > 0;

            if (!registrationValidation.isEmailValid($email_input.val())) {
                $email_input.addClass(emailErrorInputClass);

                // Hide other errors
                $emailExistsError.hide();
                $serverError.hide();
                $invalidEduEmailError.hide();

                $invalidEmailError.show();
            } else if (isStudentPlan && !registrationValidation.isEDUEmail($email_input.val())) {
                $email_input.addClass(emailErrorInputClass);

                // Hide other errors
                $emailExistsError.hide();
                $serverError.hide();
                $invalidEmailError.hide();
                $invalidEduEmailError.show();
            }
        };
        $email_input.on('blur', emailShowError);

        //--------------------------------------------------------------------------
        // Submission
        //--------------------------------------------------------------------------
        function submitEmail(forceCreate) {

            var captchaToken;
            var siteKey = '6LcD1Y0mAAAAAEKIPgcnnVdxR_3eyPF7DK0gLFs8';
            var action = 'email_registration';

            /* jshint ignore:start */
            grecaptcha.enterprise.ready(async () => {
                captchaToken = await grecaptcha.enterprise.execute(siteKey, { action: action });

                var registration_data = {
                    email: $email_input.val(),
                    plan_type: registrationModel.current_selected_plan,
                    pricing_offer: registrationModel.current_pricing_offer,
                    ga_tracking_data: $gaTrackingData.val(),
                    forceCreate: forceCreate ? 1 : 0,
                    captchaToken: captchaToken,
                    action: action
                };

                // should be getting added by Google Tag Manager in prod
                if (window.mixpanel) {
                    window.mixpanel.people.set({
                        '$email': encodeURIComponent($email_input.val()),
                    });
                }

                //Perform AJAX request if form is valid
                $.ajax({
                    contentType: 'application/json',
                    data: JSON.stringify(registration_data),
                    error: function (jqXHR) {
                        var respJSON = jqXHR.responseJSON;
                        var status = jqXHR.status;

                        if (status !== 200) {
                            var errorCode = respJSON.errorCode;
                            // There are a number of different error codes
                            // The only one that we need a specific message for is
                            // if there is an account with a billing email that matches the one they gave
                            if (errorCode === 4) {
                                // Show user an error letting them know that an account associated with this email already exists
                                // Ask them whether they would like to continue to register a new account or have the firmCode(s) sent to their email

                                $invalidEmailError.hide(); // Hide in case these were being shown previously
                                $serverError.hide();
                                $invalidEduEmailError.hide();
                                $emailExistsError.show();

                            } else {
                                // Let user know that a server error occurred. Ask them to try again or contact support.
                                $emailExistsError.hide(); // Hide in case these were being shown previously
                                $invalidEmailError.hide();
                                $invalidEduEmailError.hide();
                                $serverError.show();
                            }

                            // Add input error styling
                            $email_input.addClass(emailErrorInputClass);
                        }
                    },
                    method: 'post',
                    url: '/emailRegistration',
                    success: function (data) {
                        if (window.mixpanel) {
                            window.mixpanel.track('Trial_get_started');
                        }

                        // Redirect to success page
                        var redirUrl = '/registration-successful?' +
                            'offer=' + registrationModel.current_pricing_offer +
                            '&plan=' + registrationModel.current_selected_plan +
                            '&email=' + encodeURIComponent($email_input.val());
                        window.location.href = redirUrl;
                    }
                });
            });
            /* jshint ignore:end */
        }

        // Pressing enter key will submit - we didn't use a form because we want the handler called
        $email_input.keypress(function(e) {
            if (e.which === 13) {
                $submit_button.click();
            }
        });

        // Handles user clicking email submit button
        $submit_button.click(function (event) {
            if (event) {
                // Prevent link click from jumping to top of page
                event.preventDefault();
            }

            var isValidEmail = registrationValidation.isEmailValid($email_input.val());
            var isStudentPlan = $('.registration.student').length > 0;

            if (isStudentPlan) {
                // check that email ends in .edu
                isValidEmail = registrationValidation.isEDUEmail($email_input.val());
            }

            // Make sure email is valid
            if (isValidEmail) {
                submitEmail(false);
            } else {
                $email_input.focus();
            }
        });

        // Forces email through if user decides to create another account
        $forceCreateAccountButton.click(function (event) {
            if (event) {
                // Prevent link click from jumping to top of page
                event.preventDefault();
            }

            submitEmail(true);
        });
    }

    // this is poor form, but it adds the logic to the window in order to create
    // global access
    window.togglePrice = togglePrice;

    var query_string_pricing_offer_type = getQueryString('pricingOfferType');
    //if we are sent a pricingOfferType in the querystring, then reconfigure the regilstration form with the correct offer type
    if(query_string_pricing_offer_type !== ''){
        $('.registration').removeClass('legal').addClass(query_string_pricing_offer_type);
    }

    if ($('.registration.business').length > 0) {
        //console.log('BUSINESS REGISTRATION');
        registrationModel.current_pricing_offer = 'business';
        registrationModel.current_selected_plan = 'tier2';
    }
    if ($('.registration.florida-bar').length > 0) {
        //console.log('FLORIDA REGISTRATION');
        registrationModel.current_pricing_offer = 'florida';
        registrationModel.current_selected_plan = 'tier2';
    }
    if ($('.registration.georgia-bar').length > 0) {
        //console.log('GEORGIA REGISTRATION');
        registrationModel.current_pricing_offer = 'georgia-bar';
        registrationModel.current_selected_plan = 'tier2';
    }
    if ($('.registration.legal').length > 0) {
        //console.log('LEGAL REGISTRATION');
        registrationModel.current_pricing_offer = 'legal';
        registrationModel.current_selected_plan = 'tier2';
    }
    if ($('.registration.michigan-cpa').length > 0) {
        //console.log('MICHIGAN CPA REGISTRATION');
        registrationModel.current_pricing_offer = 'michigan-cpa';
        registrationModel.current_selected_plan = 'tier2';
    }
    if ($('.registration.student').length > 0) {
        //console.log('STUDENT REGISTRATION');
        registrationModel.current_pricing_offer = 'student';
        registrationModel.current_selected_plan = 'tier0';
    }
    if ($('.registration.texas-bar').length > 0) {
        //console.log('TEXAS BAR');
        registrationModel.current_pricing_offer = 'texas-bar';
        registrationModel.current_selected_plan = 'tier2';
    }
    if ($('.registration.uptime').length > 0) {
        //console.log('UPTIME REGISTRATION');
        registrationModel.current_pricing_offer = 'uptime';
        registrationModel.current_selected_plan = 'tier2';
    }
    if ($('.registration.washington').length > 0) {
        //console.log('WASHINGTON REGISTRATION');
        registrationModel.current_pricing_offer = 'washington';
        registrationModel.current_selected_plan = 'tier2';
    }
    if ($('.registration.nals').length > 0) {
        //console.log('NALS REGISTRATION');
        registrationModel.current_pricing_offer = 'nals';
        registrationModel.current_selected_plan = 'tier2';
    }
    if ($('.registration.legalAssociations').length > 0) {
        //console.log('legalAssociations REGISTRATION');
        registrationModel.current_pricing_offer = 'legalAssociations';
        registrationModel.current_selected_plan = 'tier2';
    }
    // console.log('configuring registration logic');
    configureRegistrationForm('registration');
    configureRegistrationForm('secondary-registration');

    // Finally, on initialization, verify the correct page you're on and initialize
    // to the correct registration type via the query string
    var query_string_plan_type = getQueryString('plan');
    var plan_types = ['tier0', 'tier1', 'tier2', 'tier3'];

    if (query_string_plan_type !== '' && isStringInArray(query_string_plan_type, plan_types)) {
        togglePrice('registration', query_string_plan_type);
    }

    var query_string_pricing_offer = getQueryString('pricing-offer');
    var pricing_offers = ['legal', 'business'];

    if (query_string_pricing_offer !== '' && isStringInArray(query_string_pricing_offer, pricing_offers)) {
        registrationModel.current_pricing_offer = query_string_pricing_offer;
    }

    if (query_string_pricing_offer !== '' && isStringInArray(query_string_pricing_offer, pricing_offers)) {
        registrationModel.current_pricing_offer = query_string_pricing_offer;
    }

});
