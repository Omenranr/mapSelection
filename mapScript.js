let map;
const initialize = () => {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 38.7578334, lng: 26.1762449 },
        zoom: 6,
    })
}

let createMarker = (place) => {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

let getData = (data, csearch) => {
    resBound = csearch;
    resData = data;
    console.log("resBound", data);
    console.log("csearch", resData);
}

let chooseBoundary = (data) => {
    let currentSearch;
    let selectedPlace = {};
    // console.log(data[1].geojson)
    // googleObject = new GeoJSON(data[0].geojson);
    // googleObject.fillColor = $("#color").val();
    // googleObject.setMap(map);
    let pos;
    for (let i = 0; i < data.length; i++) {
        if (data[i].geojson.type == "Polygon" || data[i].geojson.type == "MutiPolygon") {
            currentSearch = data[i].geojson;
            pos = i;
            break;
        }
    }
    selectedPlace.place = data[pos];
    selectedPlace.geometry = currentSearch;
    return selectedPlace;
}

let transformSelectedBoundary = (selectedBoundary) => {
    if (selectedBoundary) {
        if (selectedBoundary.type == "MultiPolygon") {
            selectedBoundary.type = "Polygon";
            let m = 0;
            newCoordinate = [];
            for (let i = 0; i < selectedBoundary.coordinates.length; i++) {
                if (selectedBoundary.coordinates[i].length > m) {
                    m = selectedBoundary.coordinates[i][0].length;
                }
            }
            for (let i = 0; i < selectedBoundary.coordinates.length; i++) {
                if (selectedBoundary.coordinates[i][0].length == m) {
                    newCoordinate.push(selectedBoundary.coordinates[i][0]);
                }
            }
            selectedBoundary.coordinates = newCoordinate;
        }
        return selectedBoundary;
    } else {
        return null;
    }
}