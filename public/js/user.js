function initLoginButton() {
  $("#login").mouseover(function(){
    $("#logout").css("display", "block");
  });
  $("#login").mouseleave(function(){
    $("#logout").css("display", "none");
  });
  $("#editSite, #newSite, #locateMe").click(function(){
    legendGroups = 2;
    repaintMarkers();
    initLegend();
    if ($(this).attr("id") === "locateMe")
      locateMe();
    if ($(this).attr("id") === "editSite") {
      getMarkerPosition(nextSite, function (result) {
        map.setCenter(result);
        map.setZoom(8);
        nextSite = (nextSite < auth_site.length - 1) ? nextSite+1 : 0;
      });
    }
    if ($(this).attr("id") === "newSite")
      var marker = createSite();
  });
}
$(function () {
  $("#map_canvas").on("submit", "form", (function(e) {
    saveMarker(e);
  }));
  $("#map_canvas").on("click", "#delete", function(e){
    e.preventDefault();
    var id = $(this).attr("value");
    bootbox.confirm("Are you sure ? Your site will be deleted", function(result) {
      if (result) deleteMarker(id);
    });
  });
  $("#map_canvas").on("focus", "#version", function(e){
    $("#version").html("");
    $("#version").append("<option value=''></option>");
    $(existingVersion).each(function (i) {
      $("#version").append("<option value=\""+existingVersion[i]+"\">"+existingVersion[i]+"</option>");
    });
  });
});

function getGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      myPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $("#atlas-hidden-longitude").val(position.coords.longitude);
      $("#atlas-hidden-latitude").val(position.coords.latitude);
      map.setCenter(myPosition);
      map.setZoom(10);
      return;
    }, handle_errors);
  } else {
    yqlgeo.get("visitor", function(position) {
      if (response.error) {
        var error = { code: 0 };
        handle_error(error);
        return;
      }
      myPosition = new google.maps.LatLng(position.place.centroid.latitude,
          position.place.centroid.longitude);
      map.setCenter(myPosition);
      map.setZoom(10);
      return;
    });
  }
}

function handle_errors(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User did not share geolocation data");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Could not detect current position");
      break;
    case error.TIMEOUT: alert("Retrieving position timeout");
      break;
    default: alert("Unknown error");
      break;
  }
}

function locateMe()  {
  getGeolocation();
}

function getMarkerPosition(nextSite, callback)  {
  for(i = 1; i < sites.length; i++) {
    if (sites[i].siteData.uuid == auth_site[nextSite]){
      callback(sites[i].marker.getPosition());
    }
  }
  return null;
}

function createSite() {
  closeBubbles();
  myPosition = map.getCenter();
  var image = {
    url: "http://maps.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png",
    scaledSize: new google.maps.Size(32, 32)
  };
  var marker = new google.maps.Marker({
    position: myPosition,
    map: map,
    title: "New",
    icon: image,
    draggable: false,
    animation: google.maps.Animation.DROP,
  });
  marker.setDraggable(true);
  var site = newSite(myPosition);
  var fadeGroup = getFadeGroup(site);
  var infowindow = createInfoWindow(site, marker);
  var editwindow = createEditInfoWindow(site, marker);
  sites[site.id] = {"siteData": site, "marker":marker, "infowindow":infowindow, "editwindow":editwindow, "bubbleOpen":false,"editBubbleOpen":false, "fadeGroup":fadeGroup};
  return marker;
}

function getCurrentLatLng() {
  var lng = $("#atlas-hidden-longitude").val();
  var lat = $("#atlas-hidden-latitude").val();
  if ( lng !== "" && lat !== "" ){
    return new google.maps.LatLng(lat, lng);
  } else {
    return map.getCenter();
  }
}

function newSite(myPosition) {
  var site = {
    id: sites.length,
    uuid: null,
    contact: userName,
    uid: currentUser,
    name: userName + " Site",
    email: userEmail,
    show_counts: 1,
    notes: "",
    version: "",
    url: "",
    image: "",
    latitude: myPosition.lat(),
    longitude: myPosition.lng(),
    type:  "TBD",
    date_changed: new Date().toDateString(),
    date_created: new Date().toDateString()
  };
  if (moduleHasSite !== 1 && moduleUUID !== null)
    site.module = 1;
  return site;
}

function deleteMarker(site) {
  var deleted = sites[site].siteData.uuid;
  if  (deleted !== "" && deleted !== null) {
    $.ajax({
      url: "ping.php/atlas?id="+deleted,
      type: "DELETE",
      dataType: "text",
    })
        .done(function(response) {
          sites[site].marker.setMap(null);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          bootbox.alert( "Error deleting your marker - Please try again ! - " + jqXHR.statusText );
          return;
        });
  } else {
    sites[site].marker.setMap(null);
  }
  nextSite = 0;
  if (sites[site].siteData.module === 1) {
    moduleHasSite = 0;
  }
  if (moduleUUID !== null && window !== window.top) {
    parent.postMessage("update", "*");
  }
  var i = auth_site.indexOf(sites[site].siteData.uuid);
  if(i !== -1) {
    auth_site.splice(i, 1);
  }
  i = sites.indexOf(site);
  if(i !== -1) {
    sites.splice(i, 1);
  }
  if (auth_site.length === 0)
    $("#editSite").attr("hidden", true);
}

function createEditInfoWindow(site, marker) {
  var html = contentEditwindow(site);
  var infowindow = new google.maps.InfoWindow({
    content: html,
    maxWidth: 300
  });
  google.maps.event.addListener(infowindow, "closeclick", function() {
    sites[site.id].editBubbleOpen = false;
  });
  if ((site.uid == currentUser) || (site.uuid) !== null) {
    $("#map_canvas").on("click", "#undo", function(e){
      e.preventDefault();
      var id = $(this).attr("value");
      var site = sites[id].siteData;
      sites[id].marker.setDraggable(false);
      sites[id].marker.setPosition(new google.maps.LatLng(site.latitude, site.longitude));
      sites[id].editBubbleOpen = false;
      sites[id].editwindow.close();
    });
  }
  return infowindow;
}

function saveMarker(e) {
  e.preventDefault();
  var id = $("#site").val();
  var site = sites[id].siteData;
  if (moduleUUID === null || site.module !== 1) {
    var patients = $("#patients").val().trim();
    var encounters = $("#encounters").val().trim();
    var obs = $("#observations").val().trim();
    var version = $("select#version").val().trim();
    site.distribution = getSelectedDistributionValue();
    site.nonStandardDistributionName = $("#nonStandardDistributionName").val().trim();
    site.observations = obs;
    site.patients = patients;
    site.encounters = encounters;
    site.version = version;
  }
  if (site.module == 1) {
    var stats = $('#include-count').is(':checked') ? 1 : 0;
    site.show_counts = stats;
  }

  var image = $("#image").val();
  var name = $("#name").val().trim();
  var mail = $("#email").val().trim();
  var notes = $("#notes").val().trim();
  var contact =$("#contact").val().trim();
  var url  = $("#url").val().trim();
  var type = $("select#type").val().trim();
  if(name === "" || id === "") {
    bootbox.alert("Site Name is missing !");
  } else {
    var pos = sites[id].marker.getPosition();
    site.name = name;
    site.email =  mail;
    site.url = url;
    site.date_changed = new Date().toDateString();
    site.contact = contact;
    site.notes = notes;
    site.image = image;
    site.type = type;
    site.longitude = pos.lng();
    site.latitude = pos.lat();
    sites[id].siteData = site;
    sites[id].fadeGroup = getFadeGroup(site);
    sites[id].infowindow.setContent(contentInfowindow(site));
    sites[id].editwindow.setContent(contentEditwindow(site));
    sites[id].editwindow.close();
    sites[id].editBubbleOpen = false;
    sites[id].marker.setDraggable(false);
    var json = JSON.stringify(site);
    $.ajax({
      url: "ping.php/atlas",
      type: "POST",
      data: json,
      dataType: "text",
    })
        .done(function(response) {
          site.uuid = response;
          if (moduleUUID !== null && moduleHasSite === 0) {
            site.module = 1;
            moduleHasSite = 1;
          }
          if (moduleUUID !== null && site.module === 1) {
            parent.postMessage("save", "*");
          }

          if (auth_site.indexOf(response) === -1)
            auth_site.push(response);
          if (auth_site.length > 0)
            $("#editSite").attr("hidden", false);

          if (site.distribution == null && (site.nonStandardDistributionName != null && site.nonStandardDistributionName != "")) {
            fetchDistributions()
                .done(function () {
                  site.distribution = getDistributionByName(site.nonStandardDistributionName).id;
                })
                .always(function () {
                  sites[id].infowindow.setContent(contentInfowindow(site));
                });
          }

          repaintMarkers();
          //bootbox.alert("Marker saved");
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          bootbox.alert( "Error saving your marker - Please try again ! - " + jqXHR.statusText );
        });
  }
  return false;
}

function contentInfowindow(site) {
  var html = "<div class='site-bubble'>";
  html += "<div class='site-name'>" + site.name + "</div>";
  html += "<div class='site-panel'>";
  if (site.image)
    html += "<img class='site-image' src='" + site.image + "' width='80px' height='80px' alt='thumbnail' />";
  if (site.url)
    html += "<div class='site-url'><a target='_blank' href='" + safeUrl(site.url) + "' title='" + site.url + "'>"
        + displayUrl(safeUrl(site.url)) + "</a></div>";
  if (site.show_counts == true) {
    if (site.patients && site.patients !== "0")
      html += "<div class='site-count'>" + addCommas(site.patients) + " patients</div>";
    if (site.encounters && site.encounters !== "0")
      html += "<div class='site-count'>" + addCommas(site.encounters) + " encounters</div>";
    if (site.observations && site.observations !== "0")
      html += "<div class='site-count'>" + addCommas(site.observations) + " observations</div>";
  }
  if (site.contact)
    html += "<div class='site-contact'><span class='site-label'>Contact:</span> " + site.contact + "</div>";

  if (site.email)
    html += "<a href='mailto:"+ site.email + "' class='site-email'><img src='images/mail.png' width='15px' height='15px'/></a>";
  html += "</div>";

  if(site.distribution){
    html += createHtmlForDistributionInfo(site.distribution);
  }

  if (site.notes)
    html += "<fieldset class='site-notes'>" + site.notes + "</fieldset>";
  if (site.type)
    html += "<div class='site-type'><span class='site-type'>" + site.type + "</span>";
  if (versionForSite(site))
    html += "<span class='site-version'>" + versionForSite(site) + "</span></div>";
  if (site.date_changed) {
    var date_updated = dateChangedString(site);
    html += "<div id='site-update'>Last Updated: " + date_updated + "</div>";
  }
  html += "</div>";
  return html;
}

function contentEditwindow(site) {
  var patients = ('patients' in counts) ? counts.patients : ('patients' in site) ? site.patients : "?";
  var encounters = ('encounters' in counts) ? counts.encounters : ('encounters' in site) ? site.encounters : "?";
  var observations = ('observations' in counts) ? counts.observations : ('observations' in site) ? site.observations : "?";
  var html = "<div class='site-bubble bubble-form'>";
  html += "<form method='post' id='"+ site.id +"'>";
  html += "<div class='form-group'><input type='text' required='true' placeholder='Site Name' title='Site Name' class='form-control input-sm' value='"+ site.name + "' id='name' name='name'></div>";
  html += "<div class='form-group'><input type='url' class='form-control input-sm' placeholder='Site URL' title='Site URL' value='"+ site.url + "' name='url' id='url'></div>";
  html += "<div class='form-group'><input type='url' class='form-control input-sm' placeholder='Image' title='Image' value='"+ site.image + "' name='image' id='image'></div>";
  html += "<div class='form-group'><input type='text' class='form-control input-sm'  placeholder='Contact' title='Contact' value='"+ site.contact + "' name='contact' id ='contact'></div>";
  html += "<div class='form-group'><input type='email' class='form-control input-sm' placeholder='Email' title='Email' value='"+ site.email + "' name='email' id='email'></div>";
  html += "<div class='form-group'><textarea class='form-control' value='' name='notes' rows='2' id='notes' placeholder='Notes'>"+ site.notes + "</textarea></div>";

  html += createDistributionSelectBox(site.distribution, site.nonStandardDistributionName);

  if (site.module !== 1) {
    html += "<div class='site-stat'>";
    html += "<div class='form-inline'>Patients <input type='number' pattern='[0-9]' class='form-control input-sm' title='Number of patients' value='"+ site.patients + "' name='patients' id ='patients'></div>";
    html += "<div class='form-inline'><br>Encounters <input type='number' pattern='[0-9]' class='form-control input-sm' title='Number of encounters' value='"+ site.encounters + "' name='encounters' id ='encounters'></div>";
    html += "<div class='form-inline'><br>Observations <input type='number' pattern='[0-9]' class='form-control input-sm' title='Number of observations' value='"+ site.observations + "' name='obs' id ='observations'></div></div><br>";
  } else if (!(typeof counts.patients === "undefined") && countsEnabled) {
    html += "<fieldset class='fieldset'>";
    html += "<legend><div class='form-inline' ><input type='checkbox' style='height:auto;bottom: 2px;position:relative' id='include-count' class='form-control input-sm' title='Include counts in the bubble'> Display counts</div></legend>";
    html += "<div class='site-stat'>";
    html += "<div class='form-inline'>" + patients + " patients</div>";
    html += "<div class='form-inline'>" + encounters + " encounters</div>";
    html += "<div class='form-inline'>" + observations + " observations</div>";
    html += "</div></fieldset>";
  }
  if (site.module !== 1) {
    html += "<div class='form-inline'> OpenMRS Version ";
    html += "<select title='OpenMRS Version' id='version' class='form-control input-sm'>";
    html += "<option selected>" + site.version + "</option>";
    html += "</select></div>";
  }

  html += "<div class='row' style='margin-top:10px;'><div class='col-xs-8'>";
  html += "<select title='Site type' id='type' class='form-control input-sm'>"
  html += (site.type == "Clinical") ? "<option selected>" : "<option>";
  html += "Clinical</option>"
  html += (site.type == "Evaluation") ? "<option selected>" : "<option>";
  html += "Evaluation</option>"
  html += (site.type == "Development") ? "<option selected>" : "<option>";
  html += "Development</option>"
  html += (site.type == "Research") ? "<option selected>" : "<option>";
  html += "Research</option>"
  html += (site.type == "Other") ? "<option selected>" : "<option>";
  html += "Other</option>"
  html += "</select></div>";
  html += "<input type='hidden' id='site' value='"+site.id+"'/>";
  html += "<div class=''><button type='submit' class='btn btn-primary'>Save</button></div></div></form></div></div>";
  return html;
}
