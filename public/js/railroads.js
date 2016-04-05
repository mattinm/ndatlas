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

require([
    "esri/Color",
    "esri/map",
    "esri/geometry/Extent",
    "esri/dijit/Scalebar",
    "esri/layers/FeatureLayer",
    "esri/layers/LayerDrawingOptions",
    "esri/layers/DynamicLayerInfo",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/renderers/DotDensityRenderer", 
    "esri/renderers/ScaleDependentRenderer",
    "esri/InfoTemplate",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/tasks/query",
    "esri/tasks/FeatureSet",
    "esri/SpatialReference",
    "esri/tasks/QueryTask",
    "esri/graphic",
    "dojo/query",
    "dojo/domReady!"
], function(Color, Map, Extent, Scalebar, FeatureLayer, LayerDrawingOptions, DynamicLayerInfo, ArcGISDynamicMapServiceLayer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleRenderer, DotDensityRenderer, ScaleDependentRenderer, InfoTemplate, ArcGISTiledMapServiceLayer, Query, FeatureSet, SpatialReference, QueryTask, Graphic, query) {
    console.log($("#loading").css('left'));
        //Loads in basemap topo instead of county layer
    map = new Map("mapDiv", {
                  basemap: "topo",
                  center: [-100.78, 46.80], //Longitude and Latitude of where the center of the map will be
                  zoom: 7,
    });
        var layer = new FeatureLayer("http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer/36"); //First layer is the county
        
        var featureLayer = new FeatureLayer("http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer/35", {
                InfoTemplate: new InfoTemplate("Built: ${Built3}", "${*}"),
                outFields: ["SOURCE_ID", "RAIL_TYPE", "ABAND_YR", "BUILT_YR", "Built2", "Built3", "miles"]
        }); //Layer that contains the rails for the railroad
        
        
        var nullSymbol = new SimpleMarkerSymbol().setSize(0);
        featureLayer.setRenderer(new SimpleRenderer(nullSymbol));
        
        var symbol = new SimpleLineSymbol (
            SimpleLineSymbol.STYLE_SHORTDOT,
            new Color([93,0,41]),
            2
        );
        featureLayer.setSelectionSymbol(symbol);
        
        
        //map.addLayer(layer);
        map.addLayer(featureLayer);
    // create our slider to show every 5 years after 1886
    layer.on("load", function(e) {
        values = [];
        for(i=1886; i<=2015; i++) {
             if (i == 1886) {
             values.push(i);
             }
             if (i % 5 == 0) {
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
        console.log(range);

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
        
        // create a function for when the slider value is set
        $('#toggleSlider').on('set', function() {
            if (!firstSet) {
                              console.log("Clearing map");
                map.graphics.clear();
            } else {
                              console.log("Not Clearing map");
                firstSet = false;
            }
                              
            map.infoWindow.hide();
            map.infoWindow.clearFeatures();
            showLoading();
                               


            // find the index of this layer
            //currentLayers.push(getCurrentLayer());

            // show the visible layers
            //layer.setVisibleLayers(visible);
            
            // see if we should scroll to a new layer

            oldYear = $(this).val();
            
            // remove all styling from legendDiv
            $("#legendDiv").attr("style", "");
            
            // FILTER WITH
            var iYear = Math.floor($(this).val());
                              //creating a query that looks for features in the layer that match a return geometry == true and the varibale 'Built3' less than the current year selected on the slider bar
                              //featureLayer.maxRecordCount = 2000;
                              var query = new Query();
                              query.returnGeometry = true;
                              query.where = "Built3 < " + iYear;
                              console.log(query);
                              featureLayer.queryFeatures(query, function(response) {
                              var feature;
                              var features = response.features;
                              console.log(features);
                              var inBuffer = [];
                              console.log(features.length);
                              for (var i = 0; i < features.length; i++) {
                                feature = features[i];
                                inBuffer.push(feature.attributes[featureLayer.objectIdField]);
                              }
                              console.log(inBuffer);
                              var query = new Query();
                              query.objectIds = inBuffer;
                              featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
                              
                              });
    });
            
        // set as the current layer
        oldLayer = 0;
        $('#toggleSlider').val(min);
        layer.setVisibility(true);
    });
    // hide the loading icon when the dynamic layer finishes updating
    featureLayer.on("selection-complete", hideLoading);

    // add the layer to the map
    //map.addLayer(layer);
    //map.addLayer(featureLayer);
    // show the scalebar
    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });
});


function getCurrentLayer() {
    // find the index of this layer
    return 35;
}

function ToggleLayer(id) {
    map.graphics.clear();
    map.infoWindow.hide();
    map.infoWindow.clearFeatures();

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

function railsBuilt(buffer) {
    var feature;
    var features = buffer.features;
    var inBuffer = [];
    for (var i = 0; i < features.length; i++) {
        feature = features[i];
        inBuffer.push(feature.attributes[featureLayer.objectIdField]);
    }
    var query = new Query();
    query.objectIds = inBuffer;
    featureLayer.selectFeatures(query, FeatureLayer.SELECTION_NEW);
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
