// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
// This gets inserted into the div with an id of "map".
var myMap = L.map("map", {
  center: [0, -10],
  zoom: 2
});

// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

const getColor = depth => 
    depth > 90 ?
    "red" :
    depth > 50 ?
    "orange" :
    depth > 10 ?
    "yellow" :
    "green";

const legend = L.control({position:"bottomright"});

legend.onAdd = function () {
  let div = L.DomUtil.create('div', 'legend');
  let colors = ['red','orange','yellow','green'];
  let depths = [90,50,10,-10];

  depths.forEach((depth,i) => {
    div.innerHTML += `<h6 style="background:${colors[i]}">>${depth}</h6>`;
  });

  return div;
};

legend.addTo(myMap);

d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson').then(data => {

  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng)
    },
    
    style: function (feature) {
      return {
        color: '#000000',
        fillColor: getColor(feature.geometry.coordinates[2]),
        opacity: 1,
        fillOpacity: 1,
        radius: feature.properties.mag*2,
        stroke: true,
        weight: 0.5
      };
    },
   

  }).bindPopup(function (layer) {
    return layer.feature.properties.place;
  }).addTo(myMap);
})

// x.features[100].properties.mag
// x.features[100].properties.place
// x.features[100].geometry.coordinates