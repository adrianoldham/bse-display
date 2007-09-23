// article title InPlaceEditor

function title_editor(id) {
  new Ajax.InPlaceEditor($('title_'+id), '/cgi-bin/admin/add.pl',
    {
    rows: 1,
    okText: 'Save',
    loadTextURL: '/cgi-bin/admin/add.pl?a_ajax_get=1&id='+id+'&field=title',
    callback: function(form, value) { return 'a_ajax_set=1&id='+id+'&field=title&value=' + encodeURIComponent(value) }
  });
}

// article body InPlaceEditor

function body_editor(id) {
  new Ajax.InPlaceEditor($('body_'+id), '/cgi-bin/admin/add.pl',
    {
    rows: 15,
    okText: 'Save',
    loadTextURL: '/cgi-bin/admin/add.pl?a_ajax_get=1&id='+id+'&field=body',
    callback: function(form, value) { return 'a_ajax_save_body=1&id='+id+'&body='+encodeURIComponent(value) }
  });
}

// wait for DOM to load before initialising

document.observe("contentloaded", function() {
  if($('bse_edit_mode')) {
    $$('div.article[id] > h1.pagetitle[id]', 'div.article[id] > h1.embedtitle[id]').each(function(e){return title_editor(e.id.match(/\d+$/)[0])});
    $$('div.article[id] > div.body[id]').each(function(e){return body_editor(e.id.match(/\d+$/)[0])});
    if(bse_debug) {
      window.alert("bse_admin loaded");
    }
  }
})