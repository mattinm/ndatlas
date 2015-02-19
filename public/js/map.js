$('#map,#narrative').css({
    'height': $(window).height()-50
});

shp("/maps/nd_counties.zip").then(function(data) {
    var map = L.map('map').setView([47, -97.5], 7.5);
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




$('#slider').click(function() {
    if ($(this).hasClass('expanded')) {
        $('#narrative').animate({width: 70});
        $(this).removeClass('expanded').find('i').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
        $('#content').hide();
    }
    else {
        $('#content').show();
        $('#narrative').animate({width: 700});
        $(this).addClass('expanded').find('i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
    }
});
