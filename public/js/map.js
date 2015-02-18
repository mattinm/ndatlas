shp("/maps/nd_counties.zip").then(function(data) {
    var map = L.map('map').setView([47, 100], 13);
    //L.geoJson(data).addTo(map);
    console.log('shit');
    L.geoJson(data).addTo(map);
    /*
    data.features.forEach(function(geo) {
        L.geoJson(geo).addTo(map);
        console.log(geo);
    });
    */
});

