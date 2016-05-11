function resizeNarrative() {
    $('#map,#narrative,#story,#map,body,html,#loadingDiv').css({
        'height': $(window).height()-54
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

var map, layer, symbol, infoTemplate, query;
var visible = [];
var firstSet = true;
var oldLayer = 0;

require([
    "esri/Color",
    "esri/map",
    "esri/dijit/Scalebar",
    "esri/InfoTemplate",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/geometry/Point",
    "esri/SpatialReference",
    "esri/graphic",
    "esri/geometry/webMercatorUtils"
], function(Color, Map, Scalebar, InfoTemplate, ArcGISTiledMapServiceLayer, Point, SpatialReference, graphic, webMercatorUtils) {
    console.log($("#loading").css('left'));

    map = new Map("mapDiv", {
        center: new Point(webMercatorUtils.lngLatToXY(-100.425, 47.3), new SpatialReference({wkid: 102100})),
        zoom: 6,
        basemap: "topo"
        
    });
    

    layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapUrl);


    layer.on("load", function(e) {
        counViews = [];
        $.each(countyLayers, function(index, value) {
            counViews.push(value);
        });
        resViews = [];
        $.each(reservationLayers, function(index, value) {
            resViews.push(value);
        });
        values = [];
        for (i=1880; i<=1920; i++) {
            if (i % 10 == 0) {
                values.push(i);
            }
        }
        
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
            start: min,
            range: range,
            snap: true
        });

        $('#toggleSlider').noUiSlider_pips({
            mode: 'values',
            density: 10,
            values: values,
            stepped: true
        });

        $('#toggleSlider').on('set', function() {
            if (!firstSet) {
                map.graphics.clear();
            } else {
                firstSet = false;
            }
                              
            map.infoWindow.hide();
            map.infoWindow.clearFeatures();
            showLoading();
            
            currentLayers = [];
            
            currentLayers.push(getCountyLayer());
            currentLayers.push(getReservationLayer());
            
            layer.setVisibleLayers(currentLayers);
            
            // remove all styling from legendDiv
            $("#legendDiv").attr("style", "");
        });

        // set as the current layer
        oldLayer = 0;
        $('#toggleSlider').val(min);
        
        layer.setScaleRange(0, 0);
        layer.setVisibility(true);
    });

    // hide the loading icon when the dynamic layer finishes updating
    layer.on("update-end", hideLoading);

    // add the layer to the map
    map.addLayer(layer);
});

function getCountyLayer() {
    val = $('#toggleSlider').val();
    console.log(val);
    if (val == 1880.00) { //before 1870 Layer 36
        return counViews[0];
    }
    else if (val == 1890.00) { //1870 to 1880 Layer 37
        return counViews[1];
    }
    else if (val == 1890.00) { //1880 to 1890 Layer 38
        return counViews[2];
    }
    else {
        return counViews[2];
    }
}

function getReservationLayer() {
    val = $('#toggleSlider').val();
    console.log(val);
    if (val == 1880.00) {
        return resViews[0];
    }
    else if (val == 1890.00) {
        return resViews[1];
    }
    else if (val == 1900.00) {
        return resViews[3];
    }
    else {
        return resViews[3];
    }
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
            $('#mapWrapper').animate({right: 45}, function() {
                map.resize(true);
                map.reposition(true);
            });
            $('#slider').removeClass('expanded').find('i').removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
            resetLoadingLocation();
        });
    }
    else {
        $('#narrative').animate({width: 460}, function() {
            $('#slider').addClass('expanded').find('i').addClass('glyphicon-chevron-right').removeClass('glyphicon-chevron-left');
            $('#story').fadeIn();
            $('#mapWrapper').animate({right: 460}, function() {
                map.resize(true);
                map.reposition(true);
            });
            resetLoadingLocation();
        });
    }
});

$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
