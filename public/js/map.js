shp("/maps/nd_counties.zip").then(function(data) {
    var map = L.map('map');
    L.geoJson(data).addTo(map);
});
