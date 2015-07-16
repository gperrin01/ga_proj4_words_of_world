// GEOLOC WILL NOT WORK FROM A FILE - NEEDS TO BE A SERVER

// store values in these objects
var Map = Map || {};
var Journey = Journey || {};
var Marker = Marker || {};
var Display = Display || {};
var Words = Words || {};


$(document).ready(function(){
  Map.initialize();
})


// ******************************************
// MAP PROPERTIES AND FUNCTIONS
// ******************************************

Map = {

  // Prepare the map iteself
  geo: navigator.geolocation,
  londonLat: 51.50722,
  londonLong: -0.12750,
  zoomInit: 13,
  zoomShowLocation: 16,
  zoomStepJourney: 16,

  // ******************************************
  // On page load: map centered in London
  // ******************************************

  initialize: function() {

    // prepare the map
    Map.geocoder = new google.maps.Geocoder();
    Map.latlng = new google.maps.LatLng(Map.londonLat, Map.londonLong);
    var mapOptions = {
      zoom: Map.zoomInit,
      center: Map.latlng,
      scrollwheel: false,
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
      },
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.LEFT_BOTTOM
      },
      panControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER
      }
    };
    Map.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // prepare the Google directions API
    Journey.directionsDisplay = new google.maps.DirectionsRenderer();
    Journey.directionsDisplay.setMap(Map.map);

    // add the initial marker (as opposed to any potential Additional marker)
    Marker.init = new google.maps.Marker({
      map: Map.map,
      position: Map.latlng,
      animation: google.maps.Animation.DROP,
      draggable: true,
      icon: Marker.init_icon,
      title: 'Move me around!'
    });
    // listener for when marker being dragged
    google.maps.event.addListener(Marker.init, 'dragend', function(){
      Marker.drag(this);
    });
    // Instantiate an info window to hold info for the markers 
    Marker.infoWindow = new google.maps.InfoWindow();
    // show the 3 words on the page and on the marker infowindow
    Display.threeWords(Map.londonLat + ', ' + Map.londonLong, Marker.init);
  },

  // ******************************************
  // On entering new address: show new pin on the map, center the map, show location, show 3 words
  // ******************************************

  setToLocation: function() {
    event.preventDefault();
    // get the coordinates of the location typed
    var address = $('#address_input').val();
    Map.geocoder.geocode( {'address': address}, function(results, status) {
      console.log('results', results);

      if (status == google.maps.GeocoderStatus.OK) {
        
        // reposition Marker.init + center map + show location + show words
        var ggl_coords = results[0].geometry.location;
        Display.centerOnUpdatedMarker(ggl_coords, Marker.init, Map.zoomShowLocation);
        Display.threeWords(ggl_coords.A + ', ' + ggl_coords.F, Marker.init);
        Display.location(ggl_coords.A + ', ' + ggl_coords.F)

      } else alert('Geocode was not successful for the following reason: ' + status);
    });
  },

  // ******************************************
  // On Refresh Current Location: update marker and map on location + show on page + get 3 words
  // ******************************************

  setToWhereAmI: function() {
    // get location using html5 native geolocation and wait for success
    if(!!Map.geo) {
      console.log('your brower supports geoloc');
      $('#three_words_list').text("Just a second while we find your location");
      var wpid = Map.geo.getCurrentPosition(Map.geoloc_success, Map.geoloc_error, {enableHighAccuracy:true, maximumAge:30000, timeout:27000});
    } else {
      alert("ERROR: Your Browser doesnt support the Html5 Geo Location API");
    }
  },

  // the 2 callback functions from Map.setToWhereAmI
  geoloc_success: function(val) {
    // once location is grabbed: show 3 words + show location + updater marker + center map
    var coords = val.coords.latitude + ', ' + val.coords.longitude;
    Display.threeWords(coords, Marker.init);
    Display.location(coords);

    var ggl_coords = new google.maps.LatLng(val.coords.latitude, val.coords.longitude)
    Display.centerOnUpdatedMarker(ggl_coords, Marker.init, Map.zoomShowLocation);
  },
  geoloc_error: function(val) {
    console.log('could not get your current location');
  },


}; // End Map Object


// ******************************************
// JOURNEY PROPERTIES AND FUNCTIONS
// ******************************************

Journey = {

  // set the directions API
  directionsService: new google.maps.DirectionsService(),
  selectedMode: 'WALKING',
  // GOOGLE often returns no_results if i don't specify UK, although i have region=GB in the script
  region: "GB",

  // ******************************************
  // When submitting a destination: show journey including steps
  // ******************************************

  show: function(noop, callback) {
    event.preventDefault();
    console.log('show journey');
    
    // ensure direction display is on and clear out any existing markerArray from previous calculations
    Display.clearJourney();

    // create the Google direction request for the route
    var origin = $('#address_input').val();
    var destination = $('#destination_input').val();
    var request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode[Journey.selectedMode],
        region: Journey.region
    };

    Journey.directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        // this creates the line from A to B
        Journey.directionsDisplay.setDirections(response);
        Journey.showSteps(response);

        // when playing journey challenge we call Journey.show(Journey.play)
        // Journey.play will be executed with the route returned by google
        (callback) ? callback(response.routes[0].legs) : console.log('no callback');
      }  
      else alert('Google Route error: ' + status);
    });
  },

  // this adds markers at each steps along the way
  showSteps: function(directionResult) {
    Journey.myRoute = directionResult.routes[0].legs[0];

    for (var i = 0; i < Journey.myRoute.steps.length; i++){
      var step_marker = new google.maps.Marker({
          position: Journey.myRoute.steps[i].start_point,
          map: Map.map
        });
      Marker.stepMarkerArray[i] = step_marker;
      // create the info window which will popup on click on marker
      Marker.attachInfo(step_marker, 'Play the Journey Challenge to unlock this location!');
    }
  }

}; // End Journey Object


// ******************************************
// Listeners on markers
// ******************************************

Marker = {

  stepMarkerArray: [],
  init: '',
  init_icon: 'http://www.agiespana.es/_portal/_widgets/googlemaps/red_marker.png',
  step_icon: "http://www.thruway.ny.gov/travelers/img/questionmark.png",
  succes_icon: "http://es.pinkbike.org/245/sprt/i/trailforks/mapicons/poi_12.png",
  destination: '',
  destination_icon: "",

  // when marker is dragged: update location and 3 words
  // also update the infoWindow
  drag: function(marker){
    var coords = marker.position.A + ', ' + marker.position.F;
    Display.threeWords(coords, marker);
    Display.location(coords);
  },

  showWords: function(marker){
    var coords = marker.position.A + ', ' + marker.position.F;
    Display.threeWords(coords, marker);
  },

  // On click on a marker, it will show info (location and 3 words)
  attachInfo: function(marker, text) {
    google.maps.event.addListener(marker, 'click', function() {
      Marker.infoWindow.setContent(text);
      Marker.infoWindow.open(Map.map, marker);
    });
  },

  // clear the stepmarkerarray = remove pins used to show a journey
  clearStepArray: function() {
    for (i = 0; i < Marker.stepMarkerArray.length; i++) {
      Marker.stepMarkerArray[i].setMap(null);
    }
  }

};  // End Marker Object


// ******************************************
// PAGE DISPLAY PROPERTIES AND FUNCTIONS
// ******************************************

Display = {

  // Display the 3 words on the infowindow of a marker
  threeWords: function(coords, marker){
    var data = {
      'key': Keys.w3w_api, // var key = process.env.W3W_KEY;
      'position': coords,
      'lang': 'en'
    };

    $.get("https://api.what3words.com/position", data, function(response){
      var words = response.words.join(' ');
      User.theThreeWords = words;
      console.log(words);

      var star = ' <span class="glyphicon glyphicon-star"></span> ';

      var html = "<div id='the_answer'><p id='three_words'>" + star + words + star + "</p>"
                + "<form id='submit_answer';><input id='answer_input' type='text' autocomplete='off' placeholder='Make the longest word'/>"
                + "<input type='submit' value='Go' />"
                + "</form>"
                + "<div id='answer_validity' class='text-center'>" 
                + "<p>Use the above words</p><p>To make the longest anagram"
                + "</p></div></div>";

      // show the marker infowindow filled with the 3 words at all time, including when clicking on it
      Marker.infoWindow.setContent(html);
      Marker.infoWindow.open(Map.map, marker);
      // ensure click enables to show the words
      Marker.attachInfo(marker, html);

      // add listener to the submit !!
      google.maps.event.addListener(Marker.infoWindow, 'domready', function(){
        $('#submit_answer').on('submit', function(){
          event.preventDefault();
          Answer.submit();
        })
      });
    });
  },

  // Display the location (based on coordinates) on the input box
  location: function(coords) {
    $.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + coords, 
      function(result) {
        var text = result.results[0].address_components[0].long_name + ' ' + result.results[0].address_components[1].long_name;
        $('#address_input').val(text);
    })
  },

  // Update marker position to new location + show marker + center map + ensure zoom close
  centerOnUpdatedMarker: function(ggl_coords, marker, zoom) {
    Display.clearJourney();
    marker.setMap(Map.map);
    marker.setPosition(ggl_coords);
    Map.map.setCenter(ggl_coords);
    Map.map.setZoom(zoom);

    // finally, clear map of any pins and directions, as we now search for one direction
    Marker.clearStepArray();
    Journey.directionsDisplay.setMap(null);
  },

  clearJourney: function() {
    Journey.directionsDisplay.setMap(Map.map);
    Marker.clearStepArray();
    Marker.init.setMap(null);
  },

  // updates view with the appropriate message &&&
  updateView: function(message, $view, valid) {
    $view.text(message);
    if (valid) {
      Display.successStyle(true);
      $('#answer_input').val('');
    } else {
      Display.successStyle(false);
    }
  },

  successStyle: function(boolean) {
    $('#answer_validity').removeClass();
    if (boolean) {
      $('#answer_validity').addClass('bg-success text-success')
    }  else {
      $('#answer_validity').addClass('bg-danger text-danger');
    }
  
  }

}; // End Display Object


// ******************************************
// Storing the word on the page
// ******************************************


    