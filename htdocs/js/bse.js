//  Attach dependant JS scripts

document.write('<script type="text/javascript" src="/js/bse_admin.js"></script>');
document.write('<script type="text/javascript" src="/js/bse_search.js"></script>');

/*
document.write('<script type="text/javascript" src="/js/bse_shop.js"></script>');
*/


// wait for DOM to load before initialising

document.observe("dom:loaded", dom_init);
Event.observe(window, "load", window_init);


function dom_init() {

    if ($('message')) {
        new Effect.Pulsate($('message'), {
            delay: 2
        });
    }

};


function window_init() {

};