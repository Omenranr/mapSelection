let place;
let marker;
let markerCircle;
let center;
let queryRes;
let selectedBoundary;
let newCoordinate;
let noBoundary = false;
const rad = 4000;
$(document).ready(function() {
    $(window).keydown(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $("#apply").trigger("click");
            return false;
        }
    });
});

$("#apply").click(function() {

    let googleObject;

    //get user input
    let search = $("#place").val();
    if (search.length != 0) {
        place = search;
    }

    //build the request object
    let request = {
        query: place,
        fields: ['name', 'geometry'],
    };

    let url = "https://nominatim.openstreetmap.org/search.php?q=" + encodeURI(place) + "&polygon_geojson=1&format=json";
    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function(json) {
            queryRes = json;
        }
    });
    //console.log(queryRes);
    let choosenRes = chooseBoundary(queryRes);
    console.log(choosenRes.place);
    selectedBoundary = choosenRes.geometry;
    selectedBoundary = transformSelectedBoundary(selectedBoundary);
    if (selectedBoundary) {
        let googleLayer = new GeoJSON(selectedBoundary);
        googleLayer.setOptions(options = {
            fillColor: $("#color").val(),
        });
        console.log("geometry", googleLayer);
        googleLayer.setMap(map);

    } else {
        console.log("no boundary");
        noBoundary = true;
    }
    map.setZoom(10);

    //creating the find place service
    service = new google.maps.places.PlacesService(map);

    //find request from query
    service.findPlaceFromQuery(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            //console.log(results, results.length);
            center = results[0].geometry.location;
            map.setCenter(center);
            // if (marker != null) {
            //     marker.setMap(null);
            //     markerCircle.setMap(null);
            //     console.log("test");
            // }
            marker = new google.maps.Marker({
                position: center,
                map: map,
            });
            markerCircle = new google.maps.Circle({
                strokeColor: $("#color").val(),
                strokeOpacity: 0.8,
                fillColor: $("#color").val(),
                fillOpacity: 0.35,
                center: center,
                radius: rad,
                editable: true,
            });
            //console.log(marker);
            if (noBoundary) { markerCircle.setMap(map); }
        } else {
            console.log("no location found");
        }
    });
    //end find place request

});