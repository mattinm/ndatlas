shp("/maps/nd_counties.zip").then(function(data) {
    var map = L.map('map').setView([47, -100], 6.5);
    var myStyle = {
        "color": "#ff0000",
        "weight": 5,
        "opacity": 0.65
    };
    
    L.geoJson(data.features, {
        style: myStyle
    }).addTo(map);
    console.log(data.features);
});

