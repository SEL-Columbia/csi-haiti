function buildData(array, labels, photoLabel) {
  var data = '<div style="width: 600px">&nbsp;</div>';
  data += '<table>';
  var j;
  for(j = 0; j < array.length; j++) {
    if (j === photoLabel) {
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
var url = 'http://a.tiles.mapbox.com/v3/modilabs.map-nuhzv2tu.jsonp';
wax.tilejson(url, function(tilejson) {
    var map = new L.Map('map-div')
    .addLayer(new wax.leaf.connector(tilejson))
    .setView(new L.LatLng(18.233748078346252, -74.02795493602753), 12);
    //wax.leaf.interaction(map, tilejson);
    var churchLayer = new L.LayerGroup();
    var settlementLayer = new L.LayerGroup();
    var gov_buildingLayer = new L.LayerGroup();
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
    $('#result').load('autres_points_d_infrastructure_janvier_2012_02_13.csv', function() {
        var array = CSV.csvToArray($('#result').html());
        var gps_col = {};
        var type_col = 0;
        var photoLabels = {};
        var i = 0;
        for (; i < array[0].length ; i++) {
            switch(array[0][i]) {
                case 'settlements/SettleGeoCode_1':
                    gps_col['settlement'] = i;
                    break;
                case 'gov_building_2/GovGeoCode_2':
                    gps_col['gov_building'] = i;
                    break;
                case 'churches_5/GovGeoCode_5':
                    gps_col['church'] = i;
                    break;
                case 'churches_5/GovPhoto_5':
                    photoLabels['church'] = i
                    break;
                case 'settlements/SettlePhoto_1':
                    photoLabels['settlement'] = i
                    break;
                case 'gov_building_2/GovPhoto_2':
                    photoLabels['gov_building'] = i
                    break;
                case 'facility_type':
                    type_col = i;
                    break;
            }
        }
        i = 1;
        var geo, lat, lng;
        for (; i < array.length; i++) {
            var type = array[i][type_col];
            geo = array[i][gps_col[type]].split(' ');
            lat = Number(geo[0]);
            lng = Number(geo[1]);
            var photoLabel;
            var marker = new L.Marker(new L.LatLng(lat, lng), {icon: icons[type]});
            switch(array[i][type_col]) {
                case 'settlement':
                    settlementLayer.addLayer(marker);
                    break;
                case 'church':
                    churchLayer.addLayer(marker);
                    break;
                case 'gov_building':
                    gov_buildingLayer.addLayer(marker);
                    break;
            }
            marker.bindPopup(buildData(array[i], array[0], photoLabels[type]), { 'maxWidth': 600 }); 
        }
        map.addLayer(settlementLayer);
        map.addLayer(churchLayer);
        map.addLayer(gov_buildingLayer);
        var baseMaps = {};
        var overlayMaps = {
            "Churches": churchLayer,
            "Settlements": settlementLayer,
            "Government Buildings": gov_buildingLayer
        };
        var layersControl = new L.Control.Layers(baseMaps, overlayMaps);
        map.addControl(layersControl);
    });
});

