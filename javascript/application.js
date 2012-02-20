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
    
     $('#ICT4AG').click(function() {
         loadMapDataIct('ict4ag_finalform_2_2012_02_10.csv', 'commune', ['gps_home', 'gps_largestparcel', 'second_parcel/second_gps'], ['photo'], 6);
        return false;
    });

    $('#showDataIct').click(function() {
        $('#map-div').hide();
        $('#result').show();
        return false;
    });

    $('#showMapIct').click(function() {
        $('#map-div').show();
        $('#result').hide();
        return false;
    });

});
