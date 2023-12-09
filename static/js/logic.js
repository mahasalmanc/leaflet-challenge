const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

let myMap = L.map("map", {
    center: [-24.3529, 54.55],
    zoom: 2
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

d3.json(url).then(function (data) {
    console.log(data);
    function mapStyle(feature){
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    function mapColor(depth){
        if (depth < 10) return "greenyellow";
        else if (depth < 30) return "yellow";
        else if (depth < 50) return "orange";
        else if (depth < 70) return "orangered";
        else if (depth < 90) return "red";
        else return "lightblue";
    }

    function mapRadius(mag){
        if(mag==0){
            return 1;
        }

        return mag * 2.5;
        }
    

    L.geoJSON(data, {

        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

        }
    }).addTo(myMap);

    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];

    for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(myMap)


    });
    


