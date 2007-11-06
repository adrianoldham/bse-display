// article title InPlaceEditor

var timer = {};

function title_editor(id,reset) {
  var title = $('title_'+id);
  var eb_id = "eb_"+id;
  add_edit_button(title, eb_id, reset);

  new Ajax.InPlaceEditor(title, '/cgi-bin/admin/add.pl',
    {
    rows: 1,
    okText: 'Save',
    externalControl: eb_id,
    externalControlOnly: true,
    loadTextURL: '/cgi-bin/admin/add.pl?a_ajax_get=1&id='+id+'&field=title',
    callback: function(form, value) { return 'a_ajax_set=1&id='+id+'&field=title&value='+encodeURIComponent(value) },
    onComplete: function(transport, element) { if (!transport) return cleanup(eb_id); title_editor(id,true) }
  });
}

// if editor is cancelled, reset visibility and class names

function cleanup(id) {
  $(id).hide();
  $(id).removeClassName("editor_control_hilite");
}

// article body InPlaceEditors

function body_editor(id,reset) {
  var body = $('body_'+id);
  var eb_id = "b_eb_"+id;
  add_edit_button(body, eb_id, reset);

  new Ajax.InPlaceEditor(body, '/cgi-bin/admin/add.pl',
    {
    rows: 15,
    okText: 'Save',
	externalControl: eb_id,
	externalControlOnly: true,
    loadTextURL: '/cgi-bin/admin/add.pl?a_ajax_get=1&id='+id+'&field=body',
    callback: function(form, value) { return 'a_ajax_save_body=1&id='+id+'&body='+encodeURIComponent(value) },
    onComplete: function(transport, element) { if (!transport) return cleanup(eb_id); body_editor(id,true) }
  });
}

function add_edit_button(e,id,reset) {

    // create, populate and position edit button container

	var ec = document.createElement('div');
	Element.extend(ec);

    ec.style.position = 'relative';
    ec.addClassName("editor_container");
    
	e.insertBefore( ec, e.firstChild);

	// create, populate and position edit button
	
	var eb = document.createElement('div');
	Element.extend(eb);
	
	eb.hide();
	eb.style.position = 'absolute';
	eb.addClassName("editor_control");
	eb.innerHTML = "Edit";
	eb.id = id;

    ec.insertBefore( eb, ec.firstChild);
    
	var clear_show = function(){if(timer[id]) clearTimeout(timer[id]); $(id).show()};
    var set_hide = function(){timer[id] = setTimeout(function(){$(id).hide()}, 1000)};
    var set_hilite = function(){eb.addClassName("editor_control_hilite")};
    var clear_hilite = function(){eb.removeClassName("editor_control_hilite")};
    
    if (!reset) {
	  e.observe("mouseover", clear_show);
	  e.observe("mouseout", set_hide);
	}
	eb.observe("mouseover", set_hilite);
	eb.observe("mouseout", clear_hilite);
}

// wait for DOM to load before initialising

document.observe("dom:loaded", function() {
  if($('bse_edit_mode')) {
    $$('div.article[id] > h1.pagetitle[id]', 'div.article[id] > h1.embedtitle[id]').each(function(e){ return title_editor(e.id.match(/\d+$/)[0]) });
    $$('div.article[id] > div.body[id]').each(function(e){ return body_editor(e.id.match(/\d+$/)[0])});
    if(bse_debug) {
      window.alert("bse_admin loaded");
    }
  }
})
