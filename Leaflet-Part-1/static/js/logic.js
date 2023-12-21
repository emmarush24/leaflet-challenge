function createMap(earthquakeMap) {
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let baseMaps = {
        "Street Map": streetmap
    };

    let overlayMaps = {
        "Earthquake Location": earthquakeMap
    };

    let map = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 4,
        layers: [streetmap, earthquakeMap]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);
}

function createMarkers(response) {

    let locations = response.features;

    let earhthquakeMarkers = [];
    let colorScale = d3.scaleQuantize()
        .domain([d3.min(locations, d => d.geometry.coordinates[2]), d3.max(locations, d => d.geometry.coordinates[2])])
        .range(["#FFFF00", "#E5F700", "#CBEE00", "#B1E200", "#97D500", "#7DCA00", "#63BF00", "#49B300", "#2FA800", "#159D00"]);
  
    for (let index = 0; index < locations.length; index++) {
      let location = locations[index];
      let fillColor = colorScale(location.geometry.coordinates[2]);
  
      let earthquakeMarker = L.circle([location.geometry.coordinates[1], location.geometry.coordinates[0]], {
        color: "#fff",
        weight: 1,
        fillOpacity: 0.75,
        fillColor: fillColor,
        radius: location.properties.mag * 20000
      }).bindPopup("<h3>" + location.properties.place + "<h3><h3>Magnitude: " + location.properties.mag + "</h3>");
  
      earhthquakeMarkers.push(earthquakeMarker);
    }

    let legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = limits = colorScale.range.map(function (d) {
            return +d;
        });
        let colors = colorScale
        let labels = [];
    
        // Add the minimum and maximum.
        let legendInfo = "<h1>Earthquake Depth</h1>" +
          "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
          "</div>";
    
        div.innerHTML = legendInfo;
    
        limits.forEach(function(limit, index) {
          labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };
    

    createMap(L.layerGroup(earhthquakeMarkers));
    legend.addTo(map)
  };

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);



