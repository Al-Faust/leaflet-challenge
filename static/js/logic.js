// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Define streetmap and darkmap layers
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: "pk.eyJ1IjoiYWwtZmF1c3QwNzMwIiwiYSI6ImNrZWMxcDV6MzAxM2Myc21uaXo5dHQ1M2kifQ.d_bT2mUsBcfPrEbigbOrMg"
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: "pk.eyJ1IjoiYWwtZmF1c3QwNzMwIiwiYSI6ImNrZWMxcDV6MzAxM2Myc21uaXo5dHQ1M2kifQ.d_bT2mUsBcfPrEbigbOrMg"
  });

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap]
  });

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    function circleStyle(feature) {
      return {
        opacity: 1,
        fillOpacity: .75,
        fillColor: circleColor(feature.properties.mag),
        color: "white",
        radius: getRadius(feature.properties.mag),
        stroke: false,
        weight: 0.5
      };
    }
    // setting color based on magnitude
      function circleColor(magnitude) {
      switch (true) {
      case magnitude > 5:
        return "red";
      case magnitude > 4:
        return "orange";
      case magnitude > 3:
        return "yellow";
      case magnitude > 2:
        return "green";
      case magnitude > 1:
        return "blue";
      default:
        return "white";
      }
    }
    // make radius reflect mag and prevent mag 0 from showing
      function getRadius(magnitude) {
      if (magnitude === 0) {
        return 1;
      }
      return magnitude * 5;
    }
      // GeoJSON layer for circles
      var earthquakes = L.geoJson(data, {
        // circles from coordinates
        pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
        },
        // apply style
        style: circleStyle,
        // add popup data to circles
        onEachFeature: function(feature, layer) {
          layer.bindPopup("<p><strong>Magnitude: </strong>" + feature.properties.mag + 
          "</p><hr><p><strong>Location: </strong>" + feature.properties.place + "</p>");
        }
      }).addTo(myMap);

      createMap(earthquakes)

  function createMap(earthquakes) {
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
    
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }
});