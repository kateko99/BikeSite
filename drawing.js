let geojson;
let line_km;

$(document).ready(function() {
    const draw_button = $('.panel__button--draw');
    const save_button = $('.panel__button--save');
    draw_button.on("click", function() { 
        mymap.pm.addControls({  
            position: 'topleft',  
            drawCircleMarker: false,
            drawMarker: false,
            drawRectangle: false,
            drawPolygon: false,
            drawCircle: false,
            //snappingOption: true
        }); 
           
    });
    save_button.on('click', function(e) {
        e.preventDefault();
        var data = $('#form_route').serializeArray();
        alert(JSON.stringify(data));

    });

    mymap.on('pm:create', function({layer}) {
        console.log(layer);
        geojson = JSON.stringify(layer.toGeoJSON());
        console.log(geojson);
        vertex_num = 0;
    });


    /* LICZENIE DYSTANSU */

    function getDistance(origin, destination) {
        // return distance in meters
        var lon1 = toRadian(origin[1]),
            lat1 = toRadian(origin[0]),
            lon2 = toRadian(destination[1]),
            lat2 = toRadian(destination[0]);
    
        var deltaLat = lat2 - lat1;
        var deltaLon = lon2 - lon1;
    
        var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
        var c = 2 * Math.asin(Math.sqrt(a));
        var EARTH_RADIUS = 6371;
        return c * EARTH_RADIUS * 1000;
    }
    function toRadian(degree) {
        return degree*Math.PI/180;
    }
    //var distance = getDistance([lat1, lng1], [lat2, lng2])
    mymap.on('pm:drawstart', ({workingLayer}) => {
        let length = 0;
        let last_vertex = {}
        workingLayer.on('pm:vertexadded', function({latlng}) {
            if(jQuery.isEmptyObject(last_vertex)) {
                $('.panel__length').text(`Długość trasy: 0 metrów.`);
                last_vertex.lat = latlng.lat;
                last_vertex.lng = latlng.lng;
            }
            else {
                console.log("Obiekt latlng: " + latlng);
                let line = parseFloat(getDistance([last_vertex.lat, last_vertex.lng], [latlng.lat, latlng.lng]));
                line_km = parseFloat(line/1000);
                new_distance = parseFloat(Math.round(line_km*100)/100);
                length = length + new_distance;
                console.log("Długość: " + length);
                $('.panel__length').text(`Długość trasy:  ${length} kilometrów.`);
                last_vertex.lat = latlng.lat;
                last_vertex.lng = latlng.lng;
            }
        })
    });

});