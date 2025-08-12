define(['lodash'], function(_) {
    if(_.isNull(window.registration_data) || _.isUndefined(window.registration_data)) {
        // this is used because for now the snippet logic has been cut out and honestly this
        // should probably be deleted
        var default_tier_object = {
            tier0: {
                snippet: 'simple-snippet'
            },
            tier1: {
                snippet: 'simple-snippet'
            },
            tier2: {
                snippet: 'simple-snippet'
            },
            tier3: {
                snippet: 'simple-snippet'
            }
        };
        window.registration_data = {
            current_selected_plan: 'tier2',
            current_pricing_offer: 'business',
            getPricingOffer: function() {
                // console.log('returning: ' + this[this.current_pricing_offer]);
                return this[this.current_pricing_offer];
            },
            getPlanType: function() {
                return this[this.current_pricing_offer][this.current_selected_plan];
            },
            business: Object.create(default_tier_object),
            florida: Object.create(default_tier_object),
            legal: Object.create(default_tier_object),
            student: Object.create(default_tier_object),
            "texas-bar": Object.create(default_tier_object),
            uptime: Object.create(default_tier_object),
            washington: Object.create(default_tier_object),
            nals: Object.create(default_tier_object),
            "georgia-bar": Object.create(default_tier_object),
            "michigan-cpa": Object.create(default_tier_object),
            legalAssociations: Object.create(default_tier_object)
        };
    }

    return window.registration_data;
});
