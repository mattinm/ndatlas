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
    
        var layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapUrl);
        
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
        $.each(togglableLayers, function(index, value) {
            values.push(layer.layerInfos[value].id);
        });
    
        years = [];
        for(i=1886; i<=2015; i++) {
             if (i == 1886) {
             years.push(i);
             }
             if (i % 5 == 0) {
                years.push(i);
             }
        }
        console.log(values);

        min = years[0];
        max = years[years.length-1];
        difference = (max - min);
        range = {
            'min': min,
            'max': max
        };

        $.each(years, function(index, value) {
            range['' + (100 - ((max - value) / difference * 100.0)) + '%'] = value;
        });
        console.log(range);

        $("#toggleSlider").noUiSlider({
            start: years[0],
            range: range,
            snap: true
        });

        $('#toggleSlider').noUiSlider_pips({
            mode: 'values',
            density: 10,
            values: years,
            stepped: true
        });
        
        // create a function for when the slider value is set
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
            currentLayers.push(getCurrentLayer());
            //layer.setVisibility(false);
            // find the index of this layer

            // show the visible layers
            //layer.setVisibleLayers(visible);
            
            //currentLayers.push(getCurrentLayer());
            
            // see if we should scroll to a new layer

            oldYear = $(this).val();
            
            // remove all styling from legendDiv
            $("#legendDiv").attr("style", "");
            
            //map.addLayer(getCurrentLayer(iYear));
            
            // FILTER WITH
            
            
            layer.setVisibleLayers(currentLayers);
            
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
        //layer.setVisibleLayers(getCurrentLayer($(this).val()));
    });
    // hide the loading icon when the dynamic layer finishes updating
    featureLayer.on("selection-complete", hideLoading);
    layer.on("update-end", hideLoading);
    
    //layer.setVisibleLayers(36);
    //layer.setVisibility(true);
    map.addLayer(layer);
    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });
});


function getCurrentLayer() {
    val = $('#toggleSlider').val();
    console.log(val);
    if (val < 1870) { //before 1870 Layer 36
        return values[0];
    }
    else if (val > 1869 && val < 1880) { //1870 to 1880 Layer 37
        return values[1];
    }
    else if (val > 1879 && val < 1890) { //1880 to 1890 Layer 38
        return values[2];
    }
    else if (val > 1889 && val < 1910) { //1890 to 1900 Layer 39
        return values[3];
    }
    else if (val > 1909 && val < 1920) { //1900 to 1910 Layer 40
        return values[4];
    }
    else {
        //After 1920 Layer 41
        return values[5];
    }


    /*
    // find the index of this layer
    //var layer;
    if (year < 1871) {
        console.log("Less then year 1871");
        //layer = new FeatureLayer("http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer/36");
        return 36;
    }
    else if (year > 1870 && year < 1881) {
        //layer = new FeatureLayer("http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer/37");
        return 37;
    }
    else if (year > 1870 && year < 1881) {
        //layer = new FeatureLayer("http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer/38");
        return 38;
    }
    else if (year > 1870 && year < 1881) {
        //layer = new FeatureLayer("http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer/39");
        return 39;
    }
    else if (year > 1900 && year < 1911) {
        //layer = new FeatureLayer("http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer/40");
        return 40;
    }
    else if (year > 1910 && year < 1921) {
        //layer = new FeatureLayer("http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer/41");
        return 41;
    }
    */
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
