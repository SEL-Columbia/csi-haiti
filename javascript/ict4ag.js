function buildDataIct(array, labels, photoCols, geoCols, hiddenCols, startCol) {
    var data = '<table class="dataPopup">';
    var photos = "";
    var j;
    for (j = startCol; j < array.length; j++) {
        if (array[j] !== 'n/a') {
            if (photoCols.indexOf(j) != -1) {
             //alert(array[j]);
                photos += '<img width="100%" height="100%" src="orepilot_photos/' + array[j] + '" />'   
            } else if (geoCols.indexOf(j) == -1 && hiddenCols.indexOf(labels[j]) == -1) {
                data += "<tr>";
                data += "<td><strong>" + labels[j] + "</strong></td>";
                data += "<td>" + array[j] + "</td>";
                data += "</tr>";
            }
        }
    }
    data += "</table>";
    return '<div style="width: 600px">&nbsp;</div>' + photos + data;
}
function buildDataTbIct(array, labels, dataId, photoCols, geoCols, hiddenCols, startCol) {
    var i;
    var j;
    var tb = '<table id = "buildData"><thead><tr>';
    for (j = startCol; j < labels.length; j++) {
        if (geoCols.indexOf(j) == -1 && photoCols.indexOf(j) == -1 && hiddenCols.indexOf(labels[j]) == -1)
            tb += "<th>" + labels[j] + "</th>";
    }
    tb += "</tr></thead><tbody>";
   
    for (i = 1; i < array.length; i++) {
        tb += "<tr>";
            for (j = startCol; j < labels.length; j++) {
                if (geoCols.indexOf(j) == -1 && photoCols.indexOf(j) == -1 && hiddenCols.indexOf(labels[j]) == -1)
                    tb += "<td>" + array[i][j] + "</td>";
            }
        tb += "</tr>";
    }
    tb += "</tbody></table>";
    $(dataId).html(tb);
    $('#buildData').dataTable();
}

function loadMapDataIct(csv, layerColunmName, gpsColumns, photoColumns, startCol) {
var url = 'http://a.tiles.mapbox.com/v3/modilabs.map-nuhzv2tu.jsonp';
    var dataID = "#result";
    wax.tilejson(url, function(tilejson) {
        var mapict = new L.Map('map-div')
            .addLayer(new wax.leaf.connector(tilejson))
            .setView(new L.LatLng(18.233748078346252, -74.02795493602753), 12);
        /*var settlementIcon = L.Icon.extend({
            iconUrl: 'icons/normal_education.png',
            iconSize: new L.Point(33, 20)
        });
        var gov_buildingIcon = L.Icon.extend({
            iconUrl: 'icons/companies.png',
            iconSize: new L.Point(32, 32)
        });
        var churchIcon = L.Icon.extend({
            iconUrl: 'icons/church.png',
            iconSize: new L.Point(32, 32)
        });
        var icons = {
            'settlement': new settlementIcon(),
            'gov_building': new gov_buildingIcon(),
            'church': new churchIcon()
        };*/
        
        $(dataID).load(csv, function() {
            var array = CSV.csvToArray($(dataID).html());
            var hiddenCols = ['_xform_id_string'];
            var gps_cols = [];
            var type_col = 0;
            var photo_cols = [];
            var i = 0;
            var layers = {};
            var layer_col = 0;
            var labels = array[0];
            for (; i < labels.length ; i++) {
                if (gpsColumns.indexOf(labels[i]) != -1) {
                   gps_cols.push(i);
                } else if (photoColumns.indexOf(labels[i]) != -1) {
                   photo_cols.push(i);
                } else if (labels[i] === layerColunmName) {
                    layer_col = i;
                    var j = 1;
                    for (; j < array.length; j++) {
                        layers[array[j][layer_col]] = 1;   
                    }
                }
            }
            // build data after getting column info
            buildDataTbIct(array, labels, dataID, gps_cols, photo_cols, hiddenCols, startCol);
            for (type in layers) {
             layers[type] = new L.LayerGroup();
            }
            i = 1;
            var geo, lat, lng;
            for (; i < array.length; i++) {
                var type = array[i][layer_col];
                j = 0;
                for (; j < gps_cols.length; j++) {
                    geo = array[i][gps_cols[j]].split(' ');  
                    if (geo.length > 1) {                  
                        lat = Number(geo[0]);  
                        lng = Number(geo[1]);
                    }
                }
                //var marker = new L.Marker(new L.LatLng(lat, lng), {icon: icons[type]});
                var marker = new L.Marker(new L.LatLng(lat, lng));
                layers[type].addLayer(marker);
                marker.bindPopup(buildDataIct(array[i], labels, photo_cols, gps_cols, hiddenCols, startCol), { 'maxWidth': 400 }); 
            }
             
            var overlayMaps = {};
            for (type in layers) {
              mapict.addLayer(layers[type]);
              overlayMaps[type] = layers[type];  
            }
            
            var baseMaps = {};
            var layersControl = new L.Control.Layers(baseMaps, overlayMaps);
            mapict.addControl(layersControl);
        });
    });
}

/*$(document).ready(function() {
 $('#ICT4AG').click(function() {
 
 loadMapDataIct('ict4ag_finalform_2_2012_02_10.csv', 'commune', ['gps_home', 'gps_largestparcel', 'second_parcel/second_gps'], ['photo'], 6)
    $('#showDataIct').click(function() {
        $('#map-div2').hide();
        $('#result2').show();
        return false;
    });

    $('#showMapIct').click(function() {
        $('#map-div2').show();
        $('#result2').hide();
        return false;
    });
    
    });
   
});*/
