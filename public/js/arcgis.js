var map, layer, dynamicLayers;
var visible = [2, 3];

require([
    "esri/map",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar"
], function(Map, Legend, Scalebar) {
    map = new Map("mapDiv", {
        center: [-100.0, 47.0],
        zoom: 7/*,
        basemap: "topo"*/
        });

    layer = new esri.layers.ArcGISDynamicMapServiceLayer("http://undgeography.und.edu/geographyund/rest/services/NDView/NDView/MapServer");
    layer.setDisableClientCaching(true);
    layer.setVisibleLayers(visible);

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

    var legend = new Legend({
        map: map
    }, "legendDiv");
    //legend.startup();
});

function ToggleLayer(id, isVisible) {
    console.log("ID: " + id + " is " + (isVisible ? "" : "NOT ") + "visible.");
    showLoading();

    dynamicLayers[id].visible = isVisible;
    if (layer.supportsDynamicLayers) {
        layer.setDynamicLayerInfos(dynamicLayers);
    } else {
        if (isVisible) {
            visible.push(id);
        } else {
            visible.splice(visible.indexOf(id), 1);
        }
        console.log(visible);
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