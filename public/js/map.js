shp("/maps/nd_counties.zip").then(function(data) {
    var map = L.map('map').setView([47, -100], 6.5);
    var myStyle = {
        "color": "#ff0000",
        "weight": 5,
        "opacity": 0.65
    };
  
    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.NAME) {
            layer.bindPopup(feature.properties.NAME);
        }
    }

    L.geoJson(data.features, {
        style: myStyle,
        onEachFeature: onEachFeature
    }).addTo(map);
    console.log(data.features);
});

