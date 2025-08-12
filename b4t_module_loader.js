define(function () {
    // Get a list of all Bill4Time modules.
    var modules = [];
    var elements = [];
    var i;

    // Find all the required modules on the page.
    if (document.querySelectorAll) {
        // Use Query Selector if it is available.
        elements = document.querySelectorAll("[data-b4tm]");
        for (i = 0; i < elements.length; i++) {
            modules.push(elements[i].getAttribute("data-b4tm"));
        }
    } else {
        // Fallback: Loop through all elements.
        elements = document.getElementsByTagName("*");
        for (i = 0; i < elements.length; i++) {
            if (elements[i].getAttribute("data-b4tm")) {
                modules.push(elements[i].getAttribute("data-b4tm"));
            }
        }
    }
    
    require(modules);
});