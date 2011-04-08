// Ajax enable main search page

document.observe("dom:loaded", search_init);

function search_init() {
    if ($('search')) {
        new Form.Observer($('search_form'), 1.5, do_search);
        $('search_submit').onclick = do_search;
    }
};

function do_search() {
  var query = $('search_q').value;
  var title = $('search_q').title;
  if (query != title && query != '') {
    $('search_form').request({
      parameters: { embed: '1'},
      onComplete: function(transport) { 
        $('search_results').innerHTML = transport.responseText;
      }
    });
  }
  return false;
};