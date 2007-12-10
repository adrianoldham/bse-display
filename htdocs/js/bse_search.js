// quick search menu

document.write('<link rel="stylesheet" type="text/css" title="screen" href="/css/basic/search_menu.css" />');

function do_search_menu() {
  var query = $('search_menu_query').value;
  if (query != 'Enter search terms' && query != '') {
    $('search_menu_form').request({
      parameters: { embed: '1', t: 'menu', pp: '5' },
      onLoading: menu_result_loading,
      onComplete: function(transport) {
        $('search_menu_results').innerHTML = transport.responseText;
        $('menu_result_close').observe('click', menu_result_close);
        $$('.menu_result_title a', '.menu_result_more a').each(function(e){e.onclick=function(){return location.href=e.href;}}); // because search_menu_results returns false, which blocks the hrefs
        menu_result_display();
      }
    });
  }
}

function menu_result_close() {
  new Effect.Fade($('search_menu_results'),{ duration: 0.5 });
  $('search_menu').style.backgroundImage = 'none';
}

function menu_result_loading() {
  $('search_menu').style.backgroundImage = 'url(/images/interface/search_menu/search_menu_bkg.gif)';
}

function menu_result_display() {
  $('search_menu').style.backgroundImage = 'none';
  $$('.menu_result_product').each(function(e){e.onclick=function(){return menu_add_single_handler(e.id.match(/\d+$/)[0])}});
  $$('.menu_result_status').each(function(e){e.style.display='none';});
  loadAccordions();
  if ($('search_menu_results').style.display == 'none') {
    new Effect.Appear($('search_menu_results'),{ duration: 0.25 });
  }
  document.body.observe('click', menu_result_close);
  $('search_menu_results').observe('click', function(e) { Event.stop(e); });
}

function loadAccordions() {
  var searchAccordion = new accordion('search_menu_container', {
    onEvent: 'mouseover',
    resizeSpeed : 9,
    classNames : {
      toggle : 'menu_result_title',
      toggleActive : '',
      content : 'menu_result_excerpt'
    }
  });
  searchAccordion.activate($$('#search_menu_container ul .menu_result_title')[0]);
}

// Wait for the DOM to load before executing

document.observe("dom:loaded", init_search_menu);

function init_search_menu() {

  if ($('search_menu')) {
  
    new Form.Observer($('search_menu_form'), 1.5, do_search_menu);

    $('search_menu_submit').style.display = 'none';
  
    $('search_menu_results').style.display = 'none';

    if (/WebKit/i.test(navigator.userAgent)) {
      $('search_menu_query').type = 'search';
      $('search_menu_query').autocomplete = 'off';
      $('search_menu_query').autocorrect = 'off';
      $('search_menu_query').autocapitalize = 'off';
    }

    $('search_menu_query').onfocus =
      function() {
        if ($('search_menu_query').value == 'Enter search terms') {
          $('search_menu_query').value = '';
        }
      }
  
    $('search_menu_query').onblur =
      function() {
        if ($('search_menu_query').value == '') {
          $('search_menu_query').value = 'Enter search terms';
        }
      }

  }

}

// add products to the cart from the quick search

function menu_add_single_handler(id) {
  menu_result_status_start(id);
  var params = new Hash({
    id: id,
    quantity: 1,
    a_add: 1,
    embed: 'sidebar',
    r: 'ajaxcart'
    });
  new Ajax.Request('/cgi-bin/shop.pl', {
    method: 'post',
    parameters: Hash.toQueryString(params),
    onComplete: function(transport) {
      $('cart_sidebar').innerHTML = transport.responseText;
      new Effect.Highlight($('cart_item_'+id), { startcolor: '#ffb27f', endcolor: '#eeeeee' });
      menu_result_status_complete(id);
    }
  });
  return false;
};

function menu_result_status_start(id) {
    $('menu_result_status_'+id).innerHTML = 'Adding item to cart...';
    new Effect.BlindDown($('menu_result_status_'+id),{ duration: 0.15 });
}

function menu_result_status_complete(id) {
    new Effect.BlindUp($('menu_result_status_'+id),{ delay: 0.5, duration: 0.15 });
    $('menu_result_status_'+id).innerHTML = '&nbsp;';
}

// main search page

function do_search() {
  var query = $('search_query').value;
  if (query != 'Enter search terms' && query != '') {
    $('search_form').request({
      parameters: { embed: '1'},
      onComplete: function(transport) { 
        $('search_results').innerHTML = transport.responseText;
      }
    });
  }
  return false;
}

// Wait for the DOM to load before executing

document.observe("dom:loaded", init_search);

function init_search() {

  if ($('search')) {

    new Form.Observer($('search_form'), 1.5, do_search);

    $('search_submit').onclick = do_search;
    
    if (/WebKit/i.test(navigator.userAgent)) {
      $('search_query').autocorrect = 'off';
      $('search_query').autocapitalize = 'off';
    }
    
    $('search_query').onfocus =
      function() {
        if ($('search_query').value == 'Enter search terms') {
          $('search_query').value = '';
        }
      }
    $('search_query').onblur =
      function() {
        if ($('search_query').value == '') {
          $('search_query').value = 'Enter search terms';
        }
      }

  }
}
