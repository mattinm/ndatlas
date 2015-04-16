function resizeNarrative() {
    $('#map,#narrative,#story,#map').css({
        'height': $(window).height()-50
    });
}
resizeNarrative();

var resizeTimeout = -1;

$(window).resize(function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeNarrative, 500);
});

// insert spinner for now
var opts = {
    lines: 13, // The number of lines to draw
    length: 20, // The length of each line
    width: 10, // The line thickness
    radius: 30, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '30%' // Left position relative to parent
};
var target = document.getElementById('map');
var spinner = new Spinner(opts).spin(target);

var worker = cw(function(base,cb){
    importScripts('/js/shp.min.js');
    shp(base).then(cb);
});

//worker can be called multiple times
worker.data(cw.makeUrl('/maps/nd_counties/nd_2010_county_data')).then(function(data){
    spinner.stop();
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
        $('#story').fadeOut(function() {
            $('#narrative').animate({width: 70});
            $('#slider').removeClass('expanded').find('i').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
        });
    }
    else {
        $('#narrative').animate({width: 700}, function() {
            $('#slider').addClass('expanded').find('i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
            $('#story').fadeIn();
        });
    }
});



$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
