google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);
var data;
var chart;
var options;

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
    //console.log($("#loading").css('left'));

    map = new Map("mapDiv", {
        center: new Point(webMercatorUtils.lngLatToXY(-100.425, 47.3), new SpatialReference({wkid: 102100})),
        zoom: 7,
        basemap: "gray"
        
        //These numbers are general approximations
        //center: new Point(2000000, 150000, new SpatialReference({wkid: 102720}))
    });
    
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
        
        //console.log("LAYERS " + values);
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
        //console.log(range);

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
                        $('#story').animate({
			                scrollTop: $('#title' + iYear).offset().top + $("#story:not(:animated)").scrollTop() - 254
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
    } else if (currentLayer >= 65 && currentLayer <= 68) {
        infoTemplate.setTitle("${NAME} County, " + currentYear);
        if (currentLayer == 65) {
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
        //console.log("Executing task: " + mapUrl + "/" + getCurrentLayer());
        queryTask = new esri.tasks.QueryTask(mapUrl + "/" + getCurrentLayer());
        queryTask.execute(query, showResults);
    }
}

function showResults(featureSet) {
    //remove all graphics on the maps graphics layer
    map.graphics.clear();
    //map.infoWindow.hide();
    map.infoWindow.clearFeatures();

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

var fields;
function drawChart() {
    var year;
    chart = new google.visualization.LineChart(document.getElementById('graph'));
    data = new google.visualization.DataTable();
    
    //Build graph options and data columns depending on which theme is displayed
    //Anthropology
    if(togglableLayers[0] <= 14) {
        options = {
            title: 'Foreign Born Population',
            vAxis: { viewWindow:{ min: 0 }},
            hAxis: { showTextEvery: 2},
            //curveType: 'function',
            legend: { position: 'bottom' },
            colors: ['#0084A8', '#89CD66', '#FF7F7F'],
            backgroundColor: '#f6f6f6'
        };
    
        data.addColumn('string', 'Decade');
        data.addColumn('number', 'Germans');
        data.addColumn('number', 'Russians');
        data.addColumn('number', 'Norwegians');

        year = 1890;
    //History
    } else if (togglableLayers[0] >= 18 && togglableLayers[0] <= 31) {
        options = {
            title: 'Making of the State to Current',
            vAxis: { viewWindow:{ min: 0 }},
            hAxis: { showTextEvery: 2},
            legend: { position: 'bottom' },
            colors: ['#F00'],
            backgroundColor: '#f6f6f6'
        };
    
        data.addColumn('string', 'Decade');
        data.addColumn('number', 'Population');

        year = 1890;
    //Religion
    } else if (togglableLayers[0] >= 65 && togglableLayers[0] <= 68) {
        options = {
            title: 'Religious Affiliation History',
            vAxis: { viewWindow:{ min: 0 }},
            legend: { position: 'bottom' },
            colors: ['#C2A83D', '#00D69E', '#9C00CC', '#F00'],
            backgroundColor: '#f6f6f6'
        };
    
        data.addColumn('string', 'Decade');
        data.addColumn('number', 'Roman Catholics');
        data.addColumn('number', 'Evangelical Lutherans (ELCA)');
        data.addColumn('number', 'Lutherans (Missouri Synod)');
        data.addColumn('number', 'United Methodists');	

        year = 1980;
    }

    var layerID;
    var length = togglableLayers.length;
    var chartQuery = new esri.tasks.Query();
    chartQuery.returnGeometry = false;
    var chartQueryTask;
    
    //Loop through layers and prepare queries depending on specific layers
    for (var i = 0; i < length; i++) {
        layerID = togglableLayers[i];
        chartQuery.where = "OBJECTID IS NOT NULL";
        chartQueryTask = new esri.tasks.QueryTask("http://undgeography.und.edu/geographyund/rest/services/ND125/WebMapND125/MapServer/" + layerID);
        
        //Anthropology
        if (layerID <= 14) {
            //Skip year 1960
            if (year == 1960) {
                year += 10;
            }
            
            if (layerID == 10) {
                chartQuery.outFields = [
                    "DTJ004", "DTJ020"
                ];
            } else if (layerID == 12) {
                chartQuery.outFields = [
                    "GWA007", "GWA021"
                ];
            } else if (layerID == 13) {
                chartQuery.outFields = [
                    "Ger" + year, "Ukr" + year, "Nor" + year
                ]
            } else if (layerID == 14) {
                chartQuery.outFields = [
                    "Ger" + year, "Ukr" + year, "Nor" + year
                ];
            } else {
                chartQuery.outFields = [
                    "Ger" + year, "Rus" + year, "Nor" + year
                ];
            }
                        
            fields = 3;
        //History
        } else if (layerID >= 18 && layerID <= 31) {
            chartQuery.outFields = [
                "Y" + year
            ];
                        
            fields = 2;
        //Religion
        } else if (layerID >= 65 && layerID <= 68) {
            if (layerID == 65) {
                chartQuery.outFields = [
                    "CATHOLIC_A", "EV_LUTH_CH", "F" + year + "_LC_M", "F" + year + "_UMC_", "F" + year + "_JEWI"
                ];
            } else {
                chartQuery.outFields = [
                    "F" + year + "_CATH", "F" + year + "_ELCA", "F" + year + "_LC_M", "F" + year + "_UMC_", "F" + year + "_JEWI"
                ];
            }
            
            fields = 4;
        } else {
            chartQuery.outFields = [ "*" ];
        }
        
        //Execute QueryTask
        chartQueryTask.execute(chartQuery, chartResults);
        
        //Increment year
        //Jump to 2013 if year is 2010 on Anthropology and Population
        if (layerID == 13 || layerID == 30) {
            year += 3;
        } else {
            year += 10;
        }
    }
}

function chartResults(results) {
    //Initialize array for results and populate it with empty data to allow for int addition
    var totals = [];
    for (var i = 0; i < fields; i++) {
        totals.push(0);
    }
    
    //Loop through every county in results layer
    var resultCount = results.features.length;
    for (var j = 0; j < resultCount; j++) {
        //Grab year value from the decade in the first field's name
        var countyAttributes = results.features[j].attributes;
        for (var attribute in countyAttributes) {
            year = attribute.replace ( /[^\d.]/g, '' );
            break;
        }
        
        //Loop through every attribute and add the int value to the totals array
        var k = 0;
        for (var attribute in countyAttributes) {            
            totals[k] += parseInt(countyAttributes[attribute]);
            k++;
        }
    }
    
    //Fix incorrect years due to database inconsistencies
    if (year > 2010) {
        year = '2013';
    } else if (year == '004' || year == '020') {
        year = '1980';
    } else if (year == '007' || year == '021') {
        year = '2000';
    } else if (year == '') {
        year = '2010';
    }
    
    //Add values to chart data table, sort the rows, and draw the chart
    //Not sure how to add varying number of parameters to a Google charts library method
    switch(fields) {
        case 2:
            data.addRow([year, totals[0]]);
            break;
        case 3:
            data.addRow([year, totals[0], totals[1], totals[2]]);
            break;
        case 4:
            data.addRow([year, totals[0], totals[1], totals[2], totals[3]]);
            break;
    }
    
    data.sort([{column: 0}]);
    chart.draw(data, options);
}

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
