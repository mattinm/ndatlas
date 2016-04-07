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

var map, layer, symbol, infoTemplate, query, featureLayer;
var visible = [];
var firstSet = true;
var oldLayer = 0;

require ([
    "esri/Color",
    "esri/map",
    "esri/geometry/Extent",
    "esri/layers/FeatureLayer",
    "esri/tasks/query",
    "esri/graphic",
    "esri/InfoTemplate",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/config",
    "dojo/dom",
    "dojo/domReady!"
], function (Color, Map, Extent, FeatureLayer, Query, Graphic, InfoTemplate, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, SimpleRenderer, esriConfig, dom) {
        console.log($("#loading").css('left'));
        
        map = new Map("mapDiv", {
                basemap: "topo",
                center: [-100.78, 46.80],
                zoom: 7,
            });
         
        var featureLayer = new FeatureLayer("http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer/56", {
                infoTemplate: new InfoTemplate("Built: ${Name}", "${*}"),
                outFields: ["Name", "Location", "Date_Org", "Date_Built", "Status", "County", "Denom", "Ethnicity"]
            });
         
        featureLayer.setScaleRange(0,0);
        var symbol = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE,
            12,
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255,0,0]),1),
                new Color([0,255,0,0.5])
            );
        featureLayer.setSelectionSymbol(symbol);
        
        var nullSymbol = new SimpleMarkerSymbol().setSize(0);
        featureLayer.setRenderer(new SimpleRenderer(nullSymbol));
        
        map.addLayer(featureLayer);
        
        featureLayer.on("load", function(e) {
                values = [];
                for (i=1870; i<=2015; i++) {
                    if (i == 1870) {
                        values.push(i);
                    }
                    else if (i % 5 == 0) {
                        values.push(i);
                    }
                }
                console.log(values);
                
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
                $("#toggleSlider").noUiSlider({
                    start: values[0],
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
                    }
                    else {
                        firstSet = false;
                    }
                    
                    map.infoWindow.hide();
                    map.infoWindow.clearFeatures();
                    showLoading();
                    oldYear = $(this).val();
                    
                    $("#legendDiv").attr("style", "");
                    
                    var iYear = Math.floor($(this).val());
                    var query = new Query();
                    query.returnGeometry = true;
                    query.where = "Date_Org < " + iYear;
                    console.log(query);
                    featureLayer.queryFeatures(query, function(response) {
                        var feature;
                        var features = response.features;
                        console.log(features);
                        var inBuffer = [];
                        for (var i=0; i < features.length; i++) {
                            feature = features[i];
                            inBuffer.push(feature.attributes[featureLayer.objectIdField]);
                        }
                        console.log(inBuffer);
                        var query = Query();
                        query.objectIds = inBuffer;
                        featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
                    });
                });
                
                oldLayer = 0;
                $('#toggleSlider').val(min);
                featureLayer.setVisibility(true);
            });
            
            featureLayer.on("selection-complete", hideLoading);
            var scalebar = new Scalebar({
                map: map,
                scalebarUnit: "dual"
            });
    });
        
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
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        