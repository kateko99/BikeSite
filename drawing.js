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
            snappingOption: true
        }); 
           
    });
    save_button.on('click', function(e) {
        e.preventDefault();
        var data = $('#form_route').serializeArray();
        alert(JSON.stringify(data));
    });

    /* Wstawka z Gridem i snapowaniem */

    var drawing = false;
    var editLayer = new L.LayerGroup();
    mymap.addLayer(editLayer);
    var roadsLayer;

	function setupVectorGrid(){
      if(roadsLayer){
        mymap.removeLayer(roadsLayer);
      }
        roadsLayer = new L.VectorGrid.Slicer(drogi, {
            minZoom: 1,
            maxZoom: 20,
            rendererFactory: L.svg.tile,
            interactive: true,
            vectorTileLayerStyles: {
                sliced: (properties, zoom) => {
                return {
                    weight: 1,
                    color: 'blue',
                    fill: true
                };
                }
            },

            getId: (f) => {
                return f.properties.osm_id;
            },
            getClass: (f) => {
                return f.properties.fclass;
            }
        });

        roadsLayer.on('mouseover', (e) => {
            if(!drawing){
                // Only trigger edit state if the edit layer button has been pressed!
                return false;
            }
            var layer = e.layer;
            var properties = layer.properties;
            var feature = drogi.features.find(f => f.properties.osm_id === properties.osm_id);

            if(feature){
                const geo = new L.GeoJSON(feature, { pmIgnore: false });
                
                editLayer.addLayer(geo);
                mymap.removeLayer(editLayer);
                mymap.addLayer(editLayer);
            }
        });
        mymap.addLayer(roadsLayer);
    }
    setupVectorGrid();
    mymap.on('pm:globaldrawmodetoggled', e => drawing = e.enabled);  //drawstart
    
	var options = {
        position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
        drawMarker: true,  // adds button to draw markers
        drawPolygon: true,  // adds button to draw a polygon
        drawPolyline: true,  // adds button to draw a polyline
        drawCircle: true,  // adds button to draw a cricle
        editPolygon: true,  // adds button to toggle global edit mode
        deleteLayer: true   // adds a button to delete layers
    };

    mymap.on('pm:globaleditmodetoggled', function({layer}) {
        console.log(layer);
        geojson = JSON.stringify(layer.toGeoJSON());
        console.log(geojson);
    });  //Przy naciśnięciu edytowania wyświetla się ta warstwa w konsoli?


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
                line_km = line/1000;
                new_distance = line_km.toFixed(2);
                length = parseFloat(length) + parseFloat(new_distance);
                console.log("Długość: " + length);
                $('.panel__length').text(`Długość trasy:  ${length} kilometrów.`);
                last_vertex.lat = latlng.lat;
                last_vertex.lng = latlng.lng;
            }
        })
    });

     // Funkcja do wyświetlania dróg w zależności od zooma
    
     mymap.on('zoomend', function() {
        var zoomlevel = mymap.getZoom();
        if(zoomlevel<15) {
            if(mymap.hasLayer(roadsLayer)) 
            {
                mymap.removeLayer(roadsLayer);
            }
            else {
                console.log("The roads layer isn't active.")
            }
        }
        if(zoomlevel >=15) {
            if(mymap.hasLayer(roadsLayer)) {
                console.log("Layer is already active.");
            }
            else {
                mymap.addLayer(roadsLayer);
            }
        }
    });



    // NAWIERZCHNIE - zapis
    var array = drogi['features'];
    var motorway = [];
    var trunk = [];
    var secondary = [];
    var pedestrian = [];
    var track = [];
    var cycleway = [];
    var other = [];



    for(var i=0; i<array.length; i++) {
        var coords = array[i]["geometry"]["coordinates"];
        var type = array[i]["properties"]["fclass"];
        switch(type) {
            case "motorway":
            case "motorway_link":
                motorway.push(coords);
                break;
            case "trunk":
            case "trunk_link":
            case "primary":
            case "primary_link":
                trunk.push(coords);
                break;
            case "secondary":
            case "secondary_link":
            case "tertiary":
            case "tertiary_link":
                secondary.push(coords);
                break;
            case "unclassified":
            case "living_street":
            case "residential":
            case "pedestrian":
            case "service":
                pedestrian.push(coords);
                break;
            case "track":
            case "track_grade1":
            case "track_grade2":
            case "track_grade3":
            case "track_grade4":
            case "track_grade5":
                track.push(coords);
                break;
            case "cycleway":
                cycleway.push(coords);
                break;
            case "footway":
            case "bridleway":
            case "path":
            case "steps":
                other.push(coords);
                break;

        }
    }

    mymap.on('pm:create', ({layer}) => {

        // Narysowana droga - zamiana na LngLat
        var new_layer = turf.lineString(layer);
        coords = new_layer["geometry"]["coordinates"]["_latlngs"];
        var new_coords = [];

        for(var i = 0; i<coords.length;i++) {
            var element = [];
            element[0] = coords[i]["lng"];
            element[1] = coords[i]["lat"];
            new_coords.push(element);
        }
        draw_layer = turf.lineString(new_coords);


        // Sprawdzanie części wspólnych i obliczanie długości
        const pave_analyse = {
            sum_motorway: 0,
            sum_trunk: 0,
            sum_secondary: 0,
            sum_pedestrian: 0,
            sum_track: 0,
            sum_cycleway: 0,
            sum_other: 0
        }

        var output_layer = [];
        for(var i=0; i<motorway.length; i++) {
            var line = turf.lineString(motorway[i][0]);
            var intersect = turf.lineOverlap(draw_layer,line, {tolerance:0});
            if(intersect['features'].length>0) {
                output_layer.push(intersect);
                pave_analyse.sum_motorway = parseFloat(pave_analyse.sum_motorway) + parseFloat(turf.length(intersect).toFixed(3));
            }
        }
        for(var i=0; i<trunk.length; i++) {
            var line = turf.lineString(trunk[i][0]);
            var intersect = turf.lineOverlap(draw_layer,line, {tolerance:0});
            if(intersect['features'].length>0) {
                output_layer.push(intersect);
                pave_analyse.sum_trunk = parseFloat(pave_analyse.sum_trunk) + parseFloat(turf.length(intersect).toFixed(3));
            }
        }
        for(var i=0; i<secondary.length; i++) {
            var line = turf.lineString(secondary[i][0]);
            var intersect = turf.lineOverlap(draw_layer,line, {tolerance:0});
            if(intersect['features'].length>0) {
                output_layer.push(intersect);
                pave_analyse.sum_secondary = parseFloat(pave_analyse.sum_secondary) + parseFloat(turf.length(intersect).toFixed(3));
            }
        }
        for(var i=0; i<pedestrian.length; i++) {
            var line = turf.lineString(pedestrian[i][0]);
            var intersect = turf.lineOverlap(draw_layer,line, {tolerance:0});
            if(intersect['features'].length>0) {
                output_layer.push(intersect);
                pave_analyse.sum_pedestrian = parseFloat(pave_analyse.sum_pedestrian) + parseFloat(turf.length(intersect).toFixed(3));
            }
        }
        for(var i=0; i<track.length; i++) {
            var line = turf.lineString(track[i][0]);
            var intersect = turf.lineOverlap(draw_layer,line, {tolerance:0});
            if(intersect['features'].length>0) {
                output_layer.push(intersect);
                pave_analyse.sum_track = parseFloat(pave_analyse.sum_track) + parseFloat(turf.length(intersect).toFixed(3));
            }
        }
        for(var i=0; i<cycleway.length; i++) {
            var line = turf.lineString(cycleway[i][0]);
            var intersect = turf.lineOverlap(draw_layer,line, {tolerance:0});
            if(intersect['features'].length>0) {
                output_layer.push(intersect);
                pave_analyse.sum_cycleway = parseFloat(pave_analyse.sum_cycleway) + parseFloat(turf.length(intersect).toFixed(3));
            }
        }
        for(var i=0; i<other.length; i++) {
            var line = turf.lineString(other[i][0]);
            var intersect = turf.lineOverlap(draw_layer,line, {tolerance:0});
            if(intersect['features'].length>0) {
                output_layer.push(intersect);
                pave_analyse.sum_other = parseFloat(pave_analyse.sum_other) + parseFloat(turf.length(intersect).toFixed(3));
            }
        }


        console.log(output_layer);
        console.log("Długość autostrad: " + pave_analyse.sum_motorway);
        console.log("Długość głównych: " + pave_analyse.sum_trunk);
        console.log("Długość podrzędnych: " + pave_analyse.sum_secondary);
        console.log("Długość pieszo-spokojnych: " + pave_analyse.sum_pedestrian);
        console.log("Długość leśnych: " + pave_analyse.sum_track);
        console.log("Długość ścieżek rowerowych: " + pave_analyse.sum_cycleway);
        console.log("Długość innych: " + pave_analyse.sum_other);



        //console.log(new_array[323][0]);
        //console.log(new_layer);
        //var roads_layer = turf.lineString(new_array[323][0]);
        //var overlapping = turf.lineOverlap(new_layer, roads_layer);
        //console.log(overlapping);

        //var line1 = turf.lineString([[126, -11], [129, -21]]);
        //var line2 = turf.lineString([[123, -18], [131, -14]]);
        //var line3 = turf.lineString(new_layer_coords);   //ta jest w porządku 
    
        //var intersects = turf.lineIntersect(line1, line3);
        //console.log(intersects);
        // Doczytać  wtyczkę zamieniającą: https://www.npmjs.com/package/geojson-polyline
        // Utworzyć var castle = ...
        // var overlapping = turf.lineOverlap(line1, line2);
        // https://www.npmjs.com/package/@turf/line-overlap
        
    })

});