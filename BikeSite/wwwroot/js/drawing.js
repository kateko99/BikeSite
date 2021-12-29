let geojson;

$(document).ready(function () {
    const draw_button = $('.panel__button--draw');
    const save_button = $('.panel__button--save');
    draw_button.on("click", function () {
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
    save_button.on('click', function (e) {
        e.preventDefault();
        var data = $('#form_route').serializeArray();
        alert(JSON.stringify(data));

    });
    mymap.on('pm:create', function ({ layer }) {
        console.log(layer);
        geojson = JSON.stringify(layer.toGeoJSON());
        console.log(geojson);
    });

    $(".panel__button--save").click(function () {
        //alert("");
        var route = {};
        route.Name = $("#route_name").val();
        route.Description = $("#description").val();
        route.Geometry = geojson;
        var data = new Date();
        route.Date = data.toJSON();
        console.log("Data: " + route.Date);

        $.ajax({
            type: "POST",
            url: '/User/CreateRoute',
            data: JSON.stringify(route),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function () {
                // alert("Data has been added successfully.");
                alert("Sukces! :)");
            },
            error: function () {
                alert("Error while inserting data");
            }
        });
        return false;
    });

});