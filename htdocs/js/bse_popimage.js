// Popimage and gallery popup handler

var extrawidth = 0;
var extraheight = 0;
var popmiddle = 0;
var resizable = 'yes';
var bse_image_popup;

function init_bse_popup_image(init_extrawidth, init_extraheight, init_popmiddle, init_resizable) {
  extrawidth = init_extrawidth;
  extraheight = init_extraheight;
  popmiddle = init_popmiddle;
  resizable = init_resizable;
}

function bse_popup_image(article_id, image_id, width, height, tag_id, image_url) {
    
  var url = "/cgi-bin/image.pl?id=" + article_id + "&amp;imid=" + image_id + '&amp;comment=jspopup';
  var work_width = width + extrawidth;
  var work_height = height + extraheight;
  var features = 'width=' + work_width + ',height=' + work_height + ',location=no,status=no,menubar=no,scrollbars=no,resizable=' + resizable;

  // lose the old one if it exists
  if(popmiddle) {
    if(bse_image_popup != null && !bse_image_popup.closed) {
      bse_image_popup.close();
    }
    var left = window.screenX + (window.outerWidth - work_width) / 2;
    var top = window.screenY + (window.outerHeight - work_height) / 2;
    features = features + ",top=" + top + ",left=" + left;
  }
  else if(bse_image_popup != null && !bse_image_popup.closed) {
    var left = bse_image_popup.screenX;
    var top = bse_image_popup.screenY;
    features = features + ",top=" + top + ",left=" + left;
    bse_image_popup.close();
  }

  bse_image_popup = window.open(url, 'bse_image', features, 0);

  return 0;
}