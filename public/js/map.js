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
        //center: new Point(webMercatorUtils.lngLatToXY(-100.425, 47.3), new SpatialReference({wkid: 102100})),
        //zoom: 8,
        //basemap: "gray"
        
        //These numbers are general approximations
        center: new Point(2000000, 150000, new SpatialReference({wkid: 102720}))
    });

    var scale = (15000 * (3200 - document.getElementById("mapDiv").offsetWidth)) / 11;
    map.setScale(scale);
    
    // add the basemap
    /*
    var streets = new ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer", {
        opacity: 0.0,
        showAttribution: false
    });  
    map.addLayer(streets); 
    */

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

        //TODO: add topographic map background
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
            if (!firstSet) {
                map.graphics.clear();
            } else {
                firstSet = false;
            }
            map.infoWindow.hide();
            map.infoWindow.clearFeatures();
            showLoading();

            // prepare our layers for filtering
            currentLayers = [];
            $.each(backgroundLayers, function(index, value) {
                currentLayers.push(value);
            });

            // find the index of this layer
            currentLayers.push(getCurrentLayer());

            // show the visible layers
            layer.setVisibleLayers(currentLayers);
            
            // see if we should scroll to a new layer
            for (var iYear = 0; iYear < startYears.length; ++iYear) {
                if (startYears[iYear] <= $(this).val()) {
                    if (endYears[iYear] > $(this).val() && iYear != oldLayer) {
                        // jump to new content
                        oldLayer = iYear;
                        console.log("Offset: " + ($('#title' + iYear).offset().top + $("#story:not(:animated)").scrollTop() - 54));
                        $('#story').animate({
			                scrollTop: $('#title' + iYear).offset().top + $("#story:not(:animated)").scrollTop() - 54
		                }, 'slow');
                        break;
                    }
                }
            }
            
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

    // show the scalebar
    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });

    /*
    var legend = new Legend({
        map: map
    }, "legendDiv");
    legend.startup();
    */

    //Listen for click event on the map, when the user clicks on the map call executeQueryTask function.
    dojo.connect(map, "onClick", executeQueryTask);

    //Can listen for onComplete event to process results or can use the callback option in the queryTask.execute method.
    //dojo.connect(queryTask, "onComplete", showResults);

    //build query filter
    query = new esri.tasks.Query();
    query.returnGeometry = true;
    query.outFields = ["*"];
    
    infoTemplate = new esri.InfoTemplate(
        infoTitle,
        infoText
    );

    symbol = new esri.symbol.SimpleFillSymbol(
        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
            new dojo.Color([255,0,0]), 2),
            new dojo.Color([255,255,0,0]
    ));
});

function getCurrentLayer() {
    // find the index of this layer
    val = $('#toggleSlider').val();
    for (i = 0; i < values.length; ++i) {
        if (val == values[i]) {
            return togglableLayers[i];
        }
    }

    return 0;
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

function executeQueryTask(evt) {
    //onClick event returns the evt point where the user clicked on the map.
    //This is contains the mapPoint (esri.geometry.point) and the screenPoint (pixel xy where the user clicked).
    //set query geometry = to evt.mapPoint Geometry
    query.geometry = evt.mapPoint;

    var currentLayer = getCurrentLayer();
    var currentYear = parseInt($('#toggleSlider').val());
        
    //Foreign Born
    if (currentLayer >= 2 && currentLayer <= 14) {
        infoTemplate.setTitle("${NAME}${NHGISNAM}${NAME10} County, " + currentYear);
        if (currentLayer == 10 || currentLayer == 12) {
            infoTemplate.setContent(
                "${DTJ004}${GWA007} Germans<br>" +
                "${DTJ020}${GWA021} Russians"
            );
        } else {
            infoTemplate.setContent(
                "${Nor" + currentYear + "} Norwegians<br>" +
                "${Ger" + currentYear + "} Germans<br>" +
                "${Rus" + currentYear + "}${Ukr" + currentYear + "} Russians"
            );
        }
    //County Population
    } else if (currentLayer >= 18 && currentLayer <= 31) {
        infoTemplate.setTitle("${NAME} County, " + currentYear);
        infoTemplate.setContent("${Y" + currentYear + "} people");
    //Religious Affiliation    
    } else if (currentLayer >= 67 && currentLayer <= 70) {
        infoTemplate.setTitle("${NAME} County, " + currentYear);
        if (currentLayer == 67) {
            infoTemplate.setContent(
                "${CATHOLIC_A} Roman Catholics<br>" +
                "${EV_LUTH_CH} Evangelical Lutherans (ELCA)<br>" +
                "${F" + currentYear + "_LC_M} Lutherans (Missouri Synod)<br>" +
                "${F" + currentYear + "_UMC_} United Methodists<br>" +
                "${F" + currentYear + "_JEWI} Jews"
            );
        } else {
            infoTemplate.setContent(
                "${F" + currentYear + "_CATH} Roman Catholics<br>" +
                "${F" + currentYear + "_ELCA} Evangelical Lutherans (ELCA)<br>" +
                "${F" + currentYear + "_LC_M} Lutherans (Missouri Synod)<br>" +
                "${F" + currentYear + "_UMC_} United Methodists<br>" +
                "${F" + currentYear + "_JEWI} Jews"
            );
        }
    } else {
        //infoTemplate.setTitle(infoTitle);
        //infoTemplate.setContent(infoText);
    }
    
    //console.log("CLICK");

    //Execute task and call showResults on completion
    //build query task
    if ($('#toggleSlider').val()) {
        console.log("Executing task: " + mapUrl + "/" + getCurrentLayer());
        queryTask = new esri.tasks.QueryTask(mapUrl + "/" + getCurrentLayer());
        queryTask.execute(query, showResults);
    }
}

function showResults(featureSet) {
    //remove all graphics on the maps graphics layer
    map.graphics.clear();
    //map.infoWindow.hide();
    //map.infoWindow.clearFeatures();

    //QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the map.
    dojo.forEach(featureSet.features, function(feature) {
        var graphic = feature;
        graphic.setSymbol(symbol);        
        graphic.setInfoTemplate(infoTemplate);

        //Add graphic to the map graphics layer.
        map.graphics.add(graphic);
        
        map.infoWindow.setTitle(graphic.getTitle());
        map.infoWindow.setContent(graphic.getContent());
        map.infoWindow.show(query.geometry, map.getInfoWindowAnchor(query.geometry));
    });
}

$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

//var scroll = false;

//TODO: map scrolls to next year when next chapter is reached
/*$("#story").scroll(function() {
  scroll = true;
});

setInterval(function() {
    if (scroll) {
        console.log("scroll");
        scroll = false;
        //$('#title' + iYear).offset().top + $("#story:not(:animated)").scrollTop() - 54
    }
}, 250);*/
