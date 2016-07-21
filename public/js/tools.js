var popoverTemplate = '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>';

$(function () {
  $('#create-capture').click(function () {
    var lat = map.getCenter().lat();
    var lng = map.getCenter().lng();
    var zoom = map.getZoom();
    var url = "capture?legend=" + legendGroups + "&zoom="
        + zoom + "&lat=" + lat + "&lng=" + lng ;
    console.log(url);
    window.location = url ;
  });
  var message = "<b><h3>About OpenMRS Atlas</h3></b>";
  message += "This map is updated with information from OpenMRS users around the world."
  message +=" To add or edit information, you’ll need a free <a href='https://id.openmrs.org/' target='_blank' >OpenMRS ID.</a>"
  message += "<b><h3>Manually Add Information to Atlas</h3></b>";
  message += "<ul><li>Click “Sign In” and provide your <a href='https://id.openmrs.org/' target='_blank' >OpenMRS ID</a> and password.</li><li>Click the user menu with your name that appears. Choose <b>“Add New Site”</b>.</li>"
  message += "<li>Move the newly-created map marker and place it in the correct location."
  message += "</li><li>Click on the marker, then click the <b><i class='fa fa-lg fa-pencil' style='color:rgba(171, 166, 166, 1)'></i> pencil icon</b> in the pop-up box to edit your information.</li><li>Click <b>Save</b> when finished.</li></ul>";
  message += "<b><h3>Update Information Automatically from OpenMRS</h3></b>";
  message += "<ul><li>If you don't already have the Atlas module installed, <a href='https://modules.openmrs.org/#/show/10/atlas' target='_blank'>download the Atlas Module </a>from OpenMRS Modules manually or through the OpenMRS Modules Administration screen."
  message += "<li>Install the module, following the directions provide in the OpenMRS Modules Administration screen.";
  message += "</li><li>In the OpenMRS Administration page, click on “OpenMRS Atlas” to <b>sign in with your OpenMRS ID</b> and add or update your information.</li></ul>";
  $('#help').click(function () {
    bootbox.dialog({
      message: message,
      className: "help-modal",
      title: "<h2><span class='glyphicon glyphicon-question-sign'></span> <b>OpenMRS Atlas Help</b></h2>",
      buttons: {
        main: {
          label: "Done",
          className: "btn-primary",
        }
      }
    });
  });

  $("#share").popover({
    trigger: "manual",
    template: popoverTemplate,
    placement: "bottom",
    html: "true",
    content: function() {
      return "<input type='text' id='shareURL' style='width: 250px' readonly value='"+getShareUrl()+"'><em>Copy link to your clipboard to share.</em>";
    }
  });
  $("#share").on('shown.bs.popover', function () {
    $("#shareURL").select();
  });
  $('#map_canvas').click(function () {
    $("#share").popover("hide")
  });
  $("#share").click(function (e) {
    e.stopPropagation();
    $("#share").popover("toggle")
  });
});

function initDownloadButton() {
  $("#download").mouseover(function(){
    $("#screen").css("display", "block");
  });
  $("#download").mouseleave(function(){
    $("#screen").css("display", "none");
  });
  $("#1024x768, #1280x1024, #3840x2160").click(function(){
    $("#screen").css("display", "none");
  });
  var legend;
  $('#1024x768').click(function () {
    legend = (clustersEnabled == true) ? 3 : legendGroups;
    var url = "download?legend=" + legend + "&size=1024x768" + "&fade=" + fadeOverTime;
    window.location = url ;
  });
  $('#1280x1024').click(function () {
    legend = (clustersEnabled == true) ? 3 : legendGroups;
    var url = "download?legend=" + legend + "&size=1920x1080" + "&fade=" + fadeOverTime;
    window.location = url ;
  });
  $('#3840x2160').click(function () {
    legend = (clustersEnabled == true) ? 3 : legendGroups;
    var url = "download?legend=" + legend + "&size=3840x2160" + "&fade=" + fadeOverTime;
    window.location = url ;
  });

}

function customizeView() {
  if (viewParam.site !== null) {
    console.log('entered the customview');
    var site;
    sites.forEach(function(val, index) {
      console.log(val.siteData.site_id);
      if (val.siteData.site_id === viewParam.site ) {
        site = val;
        console.log(viewParam.site + site);
      }
    });
    if (site) {
      viewParam.position = site.marker.getPosition();
      console.log('if condition passed')
      setTimeout(function() {
        google.maps.event.trigger(site.marker, 'click');
      }, 1000);
    }
  }
  setTimeout(function() {
    map.setZoom(viewParam.zoom);
    map.setCenter(viewParam.position);
  }, 600);
}

function getLegend() {
  switch(legendGroups) {
    case 2 :
      return "site";
      break;
    case 0 :
      return "type";
      break;
    case 1 :
      return "version";
      break;
    default :
      return "type";
  }
}
function getShareUrl(){
  var site = getOpenBubble();
  var lat = map.getCenter().lat();
  var lng = map.getCenter().lng();
  var zoom = map.getZoom();
  var url = location.protocol + "//" + location.host + "?legend=" + getLegend() + "&zoom="
      + zoom + "&position=" + lat + "," + lng + "&clusters=" + clustersEnabled;
  url = (site == null) ? url : (url + "&site=" + site);
  return url;
}
function getOpenBubble(){
  var site = null;
  sites.forEach(function(val, index) {
    if (val.bubbleOpen === true)
      site = val.siteData.site_id;
  });
  return site;
}
