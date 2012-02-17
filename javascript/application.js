$(document).ready(function() {
    $('#Facilities').click(function() {
        loadMapData('autres_points_d_infrastructure_janvier_2012_02_13.csv', 'facility_type', ['settlements/SettleGeoCode_1', 'gov_building_2/GovGeoCode_2', 'churches_5/GovGeoCode_5'], ['churches_5/GovPhoto_5', 'settlements/SettlePhoto_1', 'gov_building_2/GovPhoto_2'], 6);
        return false;
    });

    $('#showData').click(function() {
        $('#map-div').hide();
        $('#result').show();
        return false;
    });

    $('#showMap').click(function() {
        $('#map-div').show();
        $('#result').hide();
        return false;
    });
});
