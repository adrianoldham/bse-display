//  We really need a proper loading script like scriptaculous

document.write('<script type="text/javascript" src="/js/bse_shop.js"></script>');
document.write('<script type="text/javascript" src="/js/bse_admin.js"></script>');
document.write('<script type="text/javascript" src="/js/bse_search.js"></script>');
document.write('<script type="text/javascript" src="/js/bse_cycler.js"></script>');
document.write('<script type="text/javascript" src="/js/accordion.js"></script>');

// wait for DOM to load before initialising

document.observe("dom:loaded", page_init);

var bse_debug = false;

function page_init() {
  if ($('message')) {
    new Effect.DropOut($('message'),{delay: 5});
  }
  if(bse_debug) {
    window.alert("bse_loader loaded");
  }
}