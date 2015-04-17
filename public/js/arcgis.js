var map, layer, dynamicLayers, infoTemplate;
var basevisible = [];
var visible = $.extend(true, [], basevisible);
var toggled = [];
console.log(basevisible);
console.log(visible);

require([
    "esri/Color",
    "esri/map",
    "esri/InfoTemplate",
    //"esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/tasks/query"
], function(Color, /*Legend,*/ Map, InfoTemplate, Scalebar) {
    // create the map
    map = new Map("mapDiv", {
        center: [-100.0, 47.0],
        zoom: 7/*,
        basemap: "topo"*/
    });

    console.log(arcmapurl);
    layer = new esri.layers.ArcGISDynamicMapServiceLayer(arcmapurl);
    layer.setDisableClientCaching(true);
    layer.setVisibleLayers(visible);
    layer.setMinScale(0);

    // add the layer info on load
    layer.on("load", function(e) {
        // populate our visible array
        dynamicLayers = e.target.createDynamicLayerInfosFromLayerInfos();

        $("#toggleDiv").html("<ul>");
        $.each(layer.layerInfos, function(index, obj) {
            $("#toggleDiv").append(
                '<li><input type="checkbox" ' +
                'id="layerId' + obj.id + '" ' +
                'name="layerId' + obj.id + '" ' +
                'value="' + obj.name + '"' +
                ($.inArray(obj.id, visible) != -1 ? ' checked' : '') + '>' +
                obj.name + '</li>');

            $("#layerId" + obj.id).click(function() {
                ToggleLayer(obj.id, this.checked);
            });
        });
        $("#toggleDiv").append("</ul>");
    });

    // hide the loading icon when the dynamic layer finishes updating
    layer.on("update-end", hideLoading);
    //layer.on("update-start", showLoading);

    // add the layer to the map
    map.addLayer(layer);

    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });

/*
    var legend = new Legend({
        map: map
    }, "legendDiv");
    //legend.startup();
*/

    //Listen for click event on the map, when the user clicks on the map call executeQueryTask function.
    dojo.connect(map, "onClick", executeQueryTask);

    //Can listen for onComplete event to process results or can use the callback option in the queryTask.execute method.
    //dojo.connect(queryTask, "onComplete", showResults);

    //build query filter
    query = new esri.tasks.Query();
    query.returnGeometry = true;
    query.outFields = ["*"];

    symbol = new esri.symbol.SimpleFillSymbol(
        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
        new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
            new dojo.Color([255,0,0]), 2),
            new dojo.Color([255,255,0,0.5]
    ));
});

function ToggleLayer(id, isVisible) {
    console.log("ID: " + id + " is " + (isVisible ? "" : "NOT ") + "visible.");
    showLoading();

    // update our visible arrays (don't add basevisibles to the toggled array)
    dynamicLayers[id].visible = isVisible;
    var notInBaseVisible = $.inArray(id, basevisible) == -1;
    console.log(notInBaseVisible);
    if (isVisible) {
        visible.push(id); 
        if (notInBaseVisible) {
            toggled.push(id);
        }
    } else {
        visible.splice(visible.indexOf(id), 1);
        if (notInBaseVisible) {
            toggled.splice(visible.indexOf(id), 1);
        }
        map.graphics.clear();
    }
        
    if (layer.supportsDynamicLayers) {
        layer.setDynamicLayerInfos(dynamicLayers);
    } else {
        layer.setVisibleLayers(visible);
        console.log(layer);
    }
}

function hideLoading() {
    $("#loadingDiv").hide();
}

function showLoading() {
    $("#loadingDiv").show();
}

function executeQueryTask(evt) {
    //onClick event returns the evt point where the user clicked on the map.
    //This is contains the mapPoint (esri.geometry.point) and the screenPoint (pixel xy where the user clicked).
    //set query geometry = to evt.mapPoint Geometry
    query.geometry = evt.mapPoint;

    //Execute task and call showResults on completion
    //build query task
    if (toggled.length > 0) {
        queryTask = new esri.tasks.QueryTask(arcmapurl + "/" + toggled[0]);
        queryTask.execute(query, showResults);
    }
}

function showResults(featureSet) {
    //remove all graphics on the maps graphics layer
    map.graphics.clear();

    var year = '';
    if (toggled.length > 0) {
        year = layer.layerInfos[toggled[0]].name.substr(0,4);
    }

    //QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the map.
    dojo.forEach(featureSet.features, function(feature) {
        var graphic = feature;
        graphic.setSymbol(symbol);

        //Set the infoTemplate.
        //All ${attributeName} will be substituted with the attribute value for current feature.
        infoTemplate = new esri.InfoTemplate(
            "Ancestry for ${NAME} County, ${YEAR}",
            "<b>German:</b> ${Ger" + year + "}<br/>" +
            "<b>Norweigen:</b> ${Nor" + year + "}<br/>" +
            "<b>Russian:</b> ${Rus" + year + "}"
        );
        graphic.setInfoTemplate(infoTemplate);

        //Add graphic to the map graphics layer.
        map.graphics.add(graphic);
    });
}