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
    "esri/symbols/PictureMarkerSymbol",
    "esri/renderers/SimpleRenderer",
    "esri/renderers/UniqueValueRenderer",
    "esri/config",
    "dojo/dom",
    "dojo/domReady!"
], function (Color, Map, Extent, FeatureLayer, Query, Graphic, InfoTemplate, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, PictureMarkerSymbol, SimpleRenderer, UniqueValueRenderer, esriConfig, dom) {
        console.log($("#loading").css('left'));
        ///Using new style 'topo' map for a better website design
        map = new Map("mapDiv", {
                basemap: "topo",
                center: [-100.78, 46.80],
                zoom: 7,
            });
        var layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapUrl);
         
        ///loading in county churches layer 56
        var featureLayer = new FeatureLayer("http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer/56", {
                mode: FeatureLayer.MODE_SELECTION,
                infoTemplate: new InfoTemplate("County Church", "${*}"),
                outFields: ["Name"]
            });
         
        
        var symbol = new SimpleMarkerSymbol( ///Creating new marker symbol in replacement of the one on the server
            SimpleMarkerSymbol.STYLE_CIRCLE,
            10,
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([0,0,0]),1),
                new Color([0,0,0,0.5])
            );
        var renderer = new UniqueValueRenderer(symbol, "denom3");
        renderer.addValue({
            value: "Assembly of God",
            symbol: new PictureMarkerSymbol('images/AOG.png', 15, 15)
	    });
        renderer.addValue({
            value: "Baptist",
            symbol: new PictureMarkerSymbol('images/Bap.png', 15, 15)
	    });
        renderer.addValue({
            value: "Catholic",
            symbol: new PictureMarkerSymbol('images/Cat.png', 15, 15)
	    });
        renderer.addValue({
            value: "Church of Brethren",
            symbol: new PictureMarkerSymbol('images/COB.png', 15, 15)
	    });
        renderer.addValue({
            value: "Congregational",
            symbol: new PictureMarkerSymbol('images/Con.png', 15, 15)
	    });
        renderer.addValue({
            value: "Evangelical",
            symbol: new PictureMarkerSymbol('images/Eva.png', 15, 15)
	    });
        renderer.addValue({
            value: "Lutheran",
            symbol: new PictureMarkerSymbol('images/Lut.png', 15, 15)
	    });
        renderer.addValue({
            value: "Mennonite",
            symbol: new PictureMarkerSymbol('images/Men.png', 15, 15)
	    });
        renderer.addValue({
            value: "Methodist",
            symbol: new PictureMarkerSymbol('images/Met.png', 15, 15)
	    });
        renderer.addValue({
            value: "Other",
            symbol: new PictureMarkerSymbol('images/Other.png', 15, 15)
	    });
        renderer.addValue({
            value: "Presbytarian",
            symbol: new PictureMarkerSymbol('images/Pre.png', 15, 15)
	    });
        renderer.addValue({
            value: "Reformed",
            symbol: new PictureMarkerSymbol('images/Ref.png', 15, 15)
	    });
        renderer.addValue({
            value: "Seventh Day Adventist",
            symbol: new PictureMarkerSymbol('images/Sev.png', 15, 15)
	    });
        
        map.addLayer(featureLayer);
        
        featureLayer.on("load", function(e) {
                counties = [];
                $.each(togglableLayers, function(index, value) {
                    counties.push(layer.layerInfos[value].id);
                });
        
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
                    
                    currentLayers = [];
                    currentLayers.push(getCurrentLayer());
                    
                    $("#legendDiv").attr("style", "");
                    layer.setVisibleLayers(currentLayers);
                    ///Query method used to get selected features
                    var iYear = Math.floor($(this).val());
                    var query = new Query();
                    query.returnGeometry = true;
                    query.where = "Date_Built <= " + iYear + " AND " + "status3 >= " + iYear;
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
                layer.setVisibility(true);
            });
            
            featureLayer.on("selection-complete", hideLoading);
            layer.on("update-end", hideLoading);
            featureLayer.setRenderer(renderer);
            map.addLayer(layer);
            var scalebar = new Scalebar({
                map: map,
                scalebarUnit: "dual"
            });
    });

function getCurrentLayer() {
    val = $('#toggleSlider').val();
    console.log(val);
    if (val < 1870) { //before 1870 Layer 57
        return counties[0];
    }
    else if (val > 1869 && val < 1880) { //1870 to 1880 Layer 58
        return counties[1];
    }
    else if (val > 1879 && val < 1890) { //1880 to 1890 Layer 59
        return counties[2];
    }
    else if (val > 1889 && val < 1910) { //1890 to 1900 Layer 60
        return counties[3];
    }
    else if (val > 1909 && val < 1920) { //1900 to 1910 Layer 61
        return counties[4];
    }
    else {
        //After 1920 Layer 62
        return counties[5];
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
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        