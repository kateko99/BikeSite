$(document).ready(function() {
    const draw_button = $('.draw__button');
    const finish_button = $('.finish__button');
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
    finish_button.on('click', function() {
        mymap.pm.disableDraw();
        mymap.pm.removeControls();

    });

    mymap.on('pm:create', function({layer}) {
        console.log(layer);
        const geojs_layer = layer.toGeoJSON();
        console.log(geojs_layer);

        /*
        $.ajax({
            url: "/Home/Login", // endpoint
            type: "POST",
            data: geojs_layer,
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                // success
            },
            error: function (errorData) { onError(errorData); }
        });
        */
    })
});