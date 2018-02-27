var myLocations = [
    {
        title: 'fauchon',
        lat:  24.692958,
        lng: 46.674376,
        type: 'Restaurant'
    },
    {
        title: 'buffalos',
        lat: 24.689669,
        lng: 46.67328,
        type: 'Restaurant'
    },
    {
        title: 'Roses cafe',
        lat: 24.689717,
        lng: 46.673551 ,
        type:  'Cafe'
    },
    {
        title: 'Trader vics',
        lat: 24.692293,
        lng: 46.671091,
        type:  'Restaurant'
    },
    {
        title: 'The Mansion',
        lat: 24.694289,
        lng: 46.677636,
        type: 'Restaurant'
    }
] ;
// Global Variables
var map, clientID, clientSecret;
function AppViewModel() {
var self = this;
this.searchTerm = ko.observable("");
this.markers = [];
// This function populates the infowindow when the marker is clicked. We'll only allow
this.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {
            infowindow.setContent('');
            infowindow.marker = marker;
            // Foursquare API Client
              clientID = "RJMQHGTLPL305KDYKUKFDKXMAKEKSCEQ1V1MZLOFPZDTSOJC";
            clientSecret =
                "TQKYDPWFGYU5Q0RIOPWWHU5FBNLEO11XPROKJQGH0KF5Y4KK";
            // URL for Foursquare API
            var apiUrl = 'https://api.foursquare.com/v2/venues/search?ll=' +
                marker.lat + ',' + marker.lng + '&client_id=' + clientID +
                '&client_secret=' + clientSecret + '&query=' + marker.title +
                '&v=20170708' + '&m=foursquare';
            // Foursquare API
            $.getJSON(apiUrl).done(function(marker) {
                var response = marker.response.venues[0];
                self.street = response.location.formattedAddress[0];
                self.city = response.location.formattedAddress[1];
                self.category = response.categories[0].shortName;
                self.htmlContentFoursquare =
                    '<h5 class="content">(' + self.category +
                    ')</h5>' + '<div>' +
                    '<p class="content">' +'Address: '+ self.street + '</p>' +
                    '<p class="content">' + self.city + '</p>' +
                    '</div>' + '</div>';

                infowindow.setContent(self.htmlContent + self.htmlContentFoursquare);
            }).fail(function() {
                // Send alert if fail loading from Foursquare
                alert(
                    " Please refresh your page to try again."
                );
            });
            this.htmlContent = '<div>' + '<h4 class="iw_title">' + marker.title +
                '</h4>';

            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        }
    };
this.populateAndBounceMarker = function() {
        self.populateInfoWindow(this, self.largeInfoWindow);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout((function() {
             this.setAnimation(null);
        }).bind(this), 1300);
    };
 this.initMap =function(){
           var uluru = {lat: 24.6934645, lng: 46.67675342};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: uluru
        });
        // Set InfoWindow
     this.largeInfoWindow = new google.maps.InfoWindow();
     for (var i = 0; i < myLocations.length; i++) {
            this.markerTitle = myLocations[i].title;
            this.markerLat = myLocations[i].lat;
            this.markerLng = myLocations[i].lng;
              // Google Maps marker setup
        this.marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: this.markerLat,
                    lng: this.markerLng
                },
                title: this.markerTitle,
                lat: this.markerLat,
                lng: this.markerLng,
                id: i,
                animation: google.maps.Animation.DROP,
            });
        this.marker.setMap(map);
        this.markers.push(this.marker);
        this.marker.addListener('click', this.populateAndBounceMarker);
        }
      };
  this.initMap();
this.locationsFilter = ko.computed(function() {
        var result = [];
        for (var i = 0; i < this.markers.length; i++) {
            var markerLocation = this.markers[i];
            if (markerLocation.title.toLowerCase().includes(this.searchTerm().toLowerCase())) {
                result.push(markerLocation);
                this.markers[i].setVisible(true);
            } else {
                this.markers[i].setVisible(false);
            }
        }
        return result;
    }, this);
}

googleError = function googleError() {
    alert(
        'Google Maps has failed to load. Please check your internet connection and try again'
    );
};

function startApp() {
    ko.applyBindings(new AppViewModel());
}
