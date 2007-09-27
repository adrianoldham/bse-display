// article title InPlaceEditor

var timer = {};

function title_editor(id) {
  var title = $('title_'+id);
  var eb_id = "eb_" + id;
  add_edit_button(title, eb_id);

  new Ajax.InPlaceEditor(title, '/cgi-bin/admin/add.pl',
    {
    rows: 1,
    okText: 'Save',
    externalControl: eb_id,
    externalControlOnly: true,
    loadTextURL: '/cgi-bin/admin/add.pl?a_ajax_get=1&id='+id+'&field=title',
    callback: function(form, value) { return 'a_ajax_set=1&id='+id+'&field=title&value=' + encodeURIComponent(value) }
  });
}

// article body InPlaceEditor

function body_editor(id) {
  var body = $('body_'+id);
  var eb_id = "b_eb_" + id;
  add_edit_button(body, eb_id);

  new Ajax.InPlaceEditor(body, '/cgi-bin/admin/add.pl',
    {
    rows: 15,
    okText: 'Save',
	externalControl: eb_id,
	externalControlOnly: true,
    loadTextURL: '/cgi-bin/admin/add.pl?a_ajax_get=1&id='+id+'&field=body',
    callback: function(form, value) { return 'a_ajax_save_body=1&id='+id+'&body='+encodeURIComponent(value) }
  });
}


function add_edit_button(e,id) {
	var eb = document.createElement('div');
	eb.innerHTML = "Edit";
	eb.id = id;
	Element.extend(eb);
	eb.addClassName("editor_control");
	eb.hide();
	e.parentNode.insertBefore( eb, e );

	var clear_show = function(){if(timer[id]) clearTimeout(timer[id]); $(id).show()};
    var set_hide = function(){timer[id] = setTimeout(function(){$(id).hide()}, 1000)};
    //var clear_show = function(){ if(timer[id]) clearTimeout(timer[id]); new Effect.Appear($(id),{ duration: 0.25 }); };
    //var set_hide = function(){ timer[id] = setTimeout(function() { new Effect.Fade($(id),{ duration: 0.25 }); }, 1000)};

	e.observe("mouseover", clear_show);
	e.observe("mouseout", set_hide);
	eb.observe("mouseover", clear_show);
	eb.observe("mouseout", set_hide);
}


// wait for DOM to load before initialising

document.observe("contentloaded", function() {
  if($('bse_edit_mode')) {
    $$('div.article[id] > h1.pagetitle[id]', 'div.article[id] > h1.embedtitle[id]').each(function(e){ return title_editor(e.id.match(/\d+$/)[0]) });
    $$('div.article[id] > div.body[id]').each(function(e){ return body_editor(e.id.match(/\d+$/)[0])});
    if(bse_debug) {
      window.alert("bse_admin loaded");
    }
  }
})