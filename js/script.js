var map;
// Create a new blank array for all the listing markers.
var markers = [];

function initMap() {
  // Constructor creates a new map.
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 24.816406,
      lng: 46.726953
    },
    zoom: 17,
    mapTypeControl: false
  });
  // These are the location listings.
  var locations = [{
    title: 'Imam University',
    location: {
      lat: 24.814466,
      lng: 46.705985
    }
  }, {
    title: 'Jarir Bookstore',
    location: {
      lat: 24.818152,
      lng: 46.686882
    }
  }, {
    title: 'Dar Al Uloom University',
    location: {
      lat: 24.795928,
      lng: 46.711258
    }
  }, {
    title: 'Microsoft',
    location: {
      lat: 24.805940,
      lng: 46.716837
    }
  }, {
    title: 'Astronaut Square',
    location: {
      lat: 24.794045,
      lng: 46.721731
    }
  }, {
    title: 'Shawarmer',
    location: {
      lat: 24.797973,
      lng: 46.697182
    }
  }];
  var largeInfowindow = new google.maps.InfoWindow();
  // Loops through the location array to create an array of markers on initialize.
  for (var i = 0; i < locations.length; i++) {
    // Get the position and title from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });
    locations[i].marker = marker;
    // Push the marker to our array of markers.
    markers.push(marker);
    showListings();
    showInfoWindow(marker, largeInfowindow);
  }
  // Construct the ViewModel
  var viewModel = {
    //Declaring the location list
    markers: ko.observableArray(markers),
    //The value of the search input field, the value will be updated on keyup
    query: ko.observable(''),
    //The live search function used for filtering the locations
    search: function(value) {
      // remove all the current locations from the view
      viewModel.markers([]);
      for (var x in markers) {
        if (markers[x].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          viewModel.markers.push(markers[x]);
          markers[x].setVisible(true);
        } else {
          markers[x].setVisible(false);
        }
      }
    },
    //This function used for showing an infowindow by clicking on the list
    clickedList: function(marker) {
      populateInfoWindow(marker, largeInfowindow);
      //Animate the selected marker
      marker.setAnimation(google.maps.Animation.BOUNCE);
      stopAnimation(marker);
    }
  };
  ko.applyBindings(viewModel);
  viewModel.query.subscribe(viewModel.search);
}
// This function populates the infowindow when the marker is clicked.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    //Wikipedia AJAX request
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    wikiAPI = $.ajax({
      url: wikiUrl,
      dataType: "jsonp",
      // jsonp: "callback",
    });
    wikiAPI.done(function(response) {
      var articleList = response[1];
      for (var i = 0; i < articleList.length; i++) {
        articleStr = articleList[i];
        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
        infowindow.setContent('<div>' + marker.title + '<li><a href="' + url + '">' + articleStr + '</a></li></div>');
      }
    });
    wikiAPI.fail(function(response) {
      infowindow.setContent('<div>' + marker.title + '<p>failed to get wikipedia resources!</p></div>');
    });
    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
  }
}
// This function will loop through the markers array and display them all.
function showListings() {
  var bounds = new google.maps.LatLngBounds();
  // Extend the boundaries of the map for each marker and display the marker
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}
// This function opens the infowindows and bounces the selected marker
function showInfoWindow(marker, largeInfowindow) {
  // Create an onclick event to open an infowindow at each marker.
  marker.addListener('click', function() {
    //Opens an infowindow at each marker
    populateInfoWindow(this, largeInfowindow);
    //Animate the selected marker
    this.setAnimation(google.maps.Animation.BOUNCE);
    stopAnimation(this);
  });
}

//Stops the marker animation after 0.5 sec.
function stopAnimation(marker) {
  setTimeout(function() {
    marker.setAnimation(null);
  }, 500);
}