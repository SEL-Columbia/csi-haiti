function buildData(array, labels, photoCols) {
  var data = '<div style="width: 600px">&nbsp;</div>';
  data += '<table>';
  var j;
  for(j = 0; j < array.length; j++) {
    if (photoCols.indexOf(j) != -1) {
        data += '<img width="100%" height="100%" src="https://formhub.s3.amazonaws.com/haiti_facilities_inventory/attachments/' + array[j] + '" />'   
    } else if (array[j] !== 'n/a') {
        data += "<tr>";
        data += "<td><strong>" + labels[j] + "</strong></td>";
        data += "<td>" + array[j] + "</td>";
        data += "</tr>";
    }
  }
  data += "</table>";
  return data;
}

function loadMapData(csv, layerColunmName, gpsColumns, photoColumns) {

    var url = 'http://a.tiles.mapbox.com/v3/modilabs.map-nuhzv2tu.jsonp';
    wax.tilejson(url, function(tilejson) {
        var map = new L.Map('map-div')
            .addLayer(new wax.leaf.connector(tilejson))
            .setView(new L.LatLng(18.233748078346252, -74.02795493602753), 12);
        var settlementIcon = L.Icon.extend({
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
        };
        
        $('#result').load(csv, function() {
            var array = CSV.csvToArray($('#result').html());
            var gps_cols = [];
            var type_col = 0;
            var photo_cols = [];
            var i = 0;
            var layers = {};
            var layer_col = 0;
            for (; i < array[0].length ; i++) {
                if (gpsColumns.indexOf(array[0][i]) != -1) {
                   gps_cols.push(i);
                } else if (photoColumns.indexOf(array[0][i]) != -1) {
                   photo_cols.push(i);
                } else if (array[0][i] === layerColunmName) {
                    layer_col = i;
                    var j = 1;
                    for (; j < array.length; j++) {
                        layers[array[j][layer_col]] = 1;   
                    }
                }
            }
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
                var marker = new L.Marker(new L.LatLng(lat, lng), {icon: icons[type]});
                layers[type].addLayer(marker);
                marker.bindPopup(buildData(array[i], array[0], photo_cols), { 'maxWidth': 600 }); 
            }
            var overlayMaps = {};
            for (type in layers) {
              map.addLayer(layers[type]);
              overlayMaps[type] = layers[type];  
            }
            
            // map.addLayer(churchLayer);
            //map.addLayer(gov_buildingLayer);
            var baseMaps = {};
            var layersControl = new L.Control.Layers(baseMaps, overlayMaps);
            map.addControl(layersControl);
        });
    });
}
