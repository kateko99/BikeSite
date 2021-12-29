let geojson;

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
        geojson = layer.toGeoJSON();
        console.log(geojson);
    });

});