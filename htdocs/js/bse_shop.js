// add multiple cart items from catalog

function add_multiple_handler(id) {
  // Form.request passes in all form fields, including every button
  // which isn't what we want, so do it the long way
  var params_a = $('add_multiple_form_'+id).getInputs('text');
  var params_h = $H(Form.serializeElements(params_a, 1));
  params_h = params_h.merge({ r: 'ajaxcart',
                   a_addmultiple: 1,
                   embed: 'sidebar' });
  new Ajax.Request('/cgi-bin/shop.pl', {
    method: 'post',
    onComplete: function (transport) { 
      $('cart_sidebar').innerHTML = transport.responseText;
      var elems = $('add_multiple_form_'+id).elements;
      var index;
      for (index = 0; index < elems.length; ++index) {
        var ele = elems[index];
        if (ele.name.substr(0,3) == 'qty') {
          if (ele.value > 0) {
            new Effect.Highlight($('cart_item_' + ele.name.substr(3)), { startcolor: '#ffb27f', endcolor: '#eeeeee' });
          }
          ele.value = '';
        }
      }
    },
    parameters: Hash.toQueryString(params_h)
  });
  return false;
};

// add a single cart item from catalog

function add_single_handler(id) {
  var params = new Hash({
    id: id,
    quantity: $('qty'+id).value,
    a_add: 1,
    embed: 'sidebar',
    r: 'ajaxcart'
    });
  new Ajax.Request('/cgi-bin/shop.pl', {
    method: 'post',
    parameters: Hash.toQueryString(params),
    onComplete: function(transport) {
      $('cart_sidebar').innerHTML = transport.responseText;
      $('qty'+id).value = '';
      new Effect.Highlight($('cart_item_'+id), { startcolor: '#ffb27f', endcolor: '#eeeeee' });      
    }
  });
  return false;
};

// add single cart item from shopitem

function add_shopitem_handler(id) {
  $('add_form_'+id).request({
    parameters: { r: 'ajaxcart', embed: 'sidebar' },
    onComplete: function(transport) { 
      $('cart_sidebar').innerHTML = transport.responseText;
      $('qty'+id).value = '1';
      new Effect.Highlight($('cart_item_'+id), { startcolor: '#ffb27f', endcolor: '#eeeeee' });
    }
  });
  return false;
};

// wait for DOM to load before initialising

document.observe("dom:loaded", function() {
  $$('.shop_addmultiple').each(function(e){e.onclick=function(){return add_multiple_handler(e.id.match(/\d+$/)[0])}});
  $$('.shop_addsingle').each(function(e){e.onclick=function(){return add_single_handler(e.id.match(/\d+$/)[0])}});
  $$('.shop_addshopitem').each(function(e){e.onclick=function(){return add_shopitem_handler(e.id.match(/\d+$/)[0])}});
  if(bse_debug) {
    window.alert("bse_shop loaded");
  }
});