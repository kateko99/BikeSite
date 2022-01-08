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
    var vectorGridSlice;

    function updateGeoJson(feature){
    	drogi['features'] = drogi.features.map(f => {
        if(f && f.properties && f.properties.osm_id === feature.properties.osm_id){
        	return feature;
        }
        return f;
      });
      
      setTimeout(() => setupVectorGrid(), 100);
    }

	function setupVectorGrid(){
      if(vectorGridSlice){
        mymap.removeLayer(vectorGridSlice);
    }

      vectorGridSlice = new L.VectorGrid.Slicer(drogi, {
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

          getFeatureId: (f) => {
            return f.properties.osm_id;
          },
          getClass: (f) => {
              return f.properties.fclass;
          }
        });

        vectorGridSlice.on('mouseover', (e) => {
        	if(!drawing){
          	// Only trigger edit state if the edit layer button has been pressed!
          	return false;
          }
          var layer = e.layer;
          var properties = layer.properties;
          var feature = drogi.features.find(f => f.properties.osm_id === properties.osm_id);

          if(feature){
              const geo = new L.GeoJSON(feature, { pmIgnore: false }).on('pm:update', (e) => {   //draw?
              	const layer = e.layer;
                updateGeoJson(layer.toGeoJSON());
                setTimeout(() => layer.remove(), 100)
              });
              
              editLayer.addLayer(geo);
              mymap.removeLayer(editLayer);
              mymap.addLayer(editLayer);
          }
        });
        
      	mymap.addLayer(vectorGridSlice);
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