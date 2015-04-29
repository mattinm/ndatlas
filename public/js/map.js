function resizeNarrative() {
    $('#map,#narrative,#story,#map,body,html,#loadingDiv').css({
        'height': $(window).height()-50
    });
}
resizeNarrative();

function resetLoadingLocation() {
    $("#loading").css("left", ($("#mapDiv").width() - $("#narrative").width()) / 2);
}
resetLoadingLocation();

var resizeTimeout = -1;

$(window).resize(function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeNarrative, 500);
});

var map, layer;
var visible = [];

require([
    "esri/map",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar"
], function(Map, ArcGISTiledMapServiceLayer, Legend, Scalebar) {
    console.log($("#loading").css('left'));
    map = new Map("mapDiv", {
        center: [-100.425, 47],
        zoom: 8/*,
        basemap: "topo"*/
    });

    // add the basemap
    var streets = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer", {
        opacity: 0.0,
        showAttribution: false
    });  
    map.addLayer(streets); 

    layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapUrl);
    //layer.setDisableClientCaching(true);

    // create our slider
    layer.on("load", function(e) {
        values = [];
        $.each(togglableLayers, function(index, value) {
            //console.log(index);
            //console.log(layer.layerInfos[value]);
            values.push(parseInt(layer.layerInfos[value].name));
        });

        min = values[0];
        max = values[values.length-1];
        difference = (max - min);
        range = {
            'min': min,
            'max': max
        };

        $.each(values, function(index, value) {
            range['' + (100 - ((max - value) / difference * 100.0)) + '%'] = value;
        });
        console.log(range);

        $("#toggleSlider").noUiSlider({
            start: parseInt(layer.layerInfos[togglableLayers[0]].name),
            range: range,
            snap: true
        });

        $('#toggleSlider').noUiSlider_pips({
            mode: 'values',
            density: 10,
            values: values,
            stepped: true
        });

        // create a function for when the slider value is set
        $('#toggleSlider').on('set', function() {
            showLoading();

            // prepare our layers for filtering
            currentLayers = [];
            $.each(backgroundLayers, function(index, value) {
                currentLayers.push(value);
            });

            // find the index of this layer
            val = $('#toggleSlider').val();
            for (i = 0; i < values.length; ++i) {
                if (val == values[i]) {
                    currentLayers.push(togglableLayers[i]);
                    break;
                }
            }

            // show the visible layers
            layer.setVisibleLayers(currentLayers);
        });

        // set as the current layer
        $('#toggleSlider').val(min);
    });

    // hide the loading icon when the dynamic layer finishes updating
    layer.on("update-end", hideLoading);

    // add the layer to the map
    map.addLayer(layer);

    // show the scalebar
    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });

    //var legend = new Legend({
    //    map: map
    //}, "legendDiv");
    //legend.startup();
});

function ToggleLayer(id) {
    showLoading();
}

function hideLoading() {
    $("#loadingDiv").hide();
    $("#togglableLayers").removeAttr('disabled');
}

function showLoading() {
    $("#loadingDiv").show();
    $("#togglableLayers").attr('disabled', 'disabled');
}

$('#slider').click(function() {
    if ($(this).hasClass('expanded')) {
        $('#story').fadeOut(function() {
            $('#narrative').animate({width: 45});
            $('#mapFooter').animate({right: 45});
            $('#slider').removeClass('expanded').find('i').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
            resetLoadingLocation();
        });
    }
    else {
        $('#narrative').animate({width: 460}, function() {
            $('#slider').addClass('expanded').find('i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
            $('#story').fadeIn();
            $('#mapFooter').animate({right: 460});
            resetLoadingLocation();
        });
    }
});



$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
