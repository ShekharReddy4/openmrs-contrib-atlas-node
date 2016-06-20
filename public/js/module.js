var detachDialog = "This will unlink this server from the site on the Atlas. The Atlas site will no longer be"
detachDialog += " updated by this server. <br> Are you sure you want to unlink this site?"

$(function () {
  if(window !== window.top)
    parent.postMessage("update", "*");
  $("#map_canvas").on("click", "#me-button", function(e) {
    e.preventDefault();
    var id = $(this).val();
    var site = sites[id].siteData;
    var auth = {
      site: site.uuid,
      token: moduleUUID
    }
    var json = JSON.stringify(auth);
    $.ajax({
      url: "module/auth?uuid=" + moduleUUID,
      type: "POST",
      data: json,
      dataType: "text",
    })
    .done(function(response) {
      site.module = 1;
      moduleHasSite = 1;
      sites[id].siteData = site;
      sites[id].infowindow.setContent(contentInfowindow(site));
      sites[id].editwindow.setContent(contentEditwindow(site));
      repaintMarkers();
      if(window !== window.top)
        parent.postMessage("update", "*");
      bootbox.alert('The module is now linked to ' + site.name);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      bootbox.alert( "Error saving your marker - Please try again ! - " + jqXHR.statusText );
    });
  });

  $("#map_canvas").on("click", "#detach-button", function(e) {
    e.preventDefault();
    var id = $(this).val();
    bootbox.confirm(detachDialog, function(result) {
      if (result) detachMarker(id);
    });
  });

  $("#map_canvas").on("click", "#include-count", function(e){
    $(".site-stat").toggleClass("disabled");
  });
});

function openBubble(uniqueMarker) {
  if (uniqueMarker !== null)
    google.maps.event.trigger(uniqueMarker, 'click');
}

function detachMarker(id) {
  var site = sites[id].siteData;
  $.ajax({
    url: "module/auth?uuid=" + moduleUUID,
    type: "DELETE",
    dataType: "text",
  })
  .done(function(response) {
    site.module = 0;
    moduleHasSite = 0;
    sites[id].siteData = site;
    sites[id].infowindow.setContent(contentInfowindow(site));
    sites[id].editwindow.setContent(contentEditwindow(site));
    repaintMarkers();
    if(window !== window.top)
      parent.postMessage("update", "*");
    bootbox.alert("Authorization delete");
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    bootbox.alert( "Error deleting authorization - Please try again ! - " + jqXHR.statusText );
  });
}

function openDialogID(url,width,height) 
{ 
    var top =(screen.height - width)/2; 
    var left = (screen.width - height)/2;
    window.open(url+"#redirect-to","Sign In","toolbar=0,menubar=0,location=0,status=0,scrollbars=0,resizable=no,top="+top+",left="+left+",width="+width+",height="+height); 
}
