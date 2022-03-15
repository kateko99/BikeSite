
//Funkcja - wyświetlanie nawierzchni

function showPavement(pave_percent) {

    asphalt_p = pave_percent.asphalt;
    cycle_p = pave_percent.cycle;
    forest_p = pave_percent.forest;
    other_p = pave_percent.other;

    // Wyświetlanie wartości procentowych na pasku
    // Jeśli jest <10%, nie wyświetla się liczba (mało miejsca)

    if (asphalt_p == 0) {
        $("#asphalt").css("display", "none");
    }
    else if (asphalt_p < 10) {
        $("#asphalt").css("display", "flex");
        $("#asphalt").css("width", asphalt_p + "%");
    }
    else {
        $("#asphalt").css("display", "flex");
        $("#asphalt").css("width", asphalt_p + "%");
        $("#asphalt_value").text(asphalt_p + "%");
    }

    if (cycle_p == 0) {
        $("#cycle").css("display", "none");
    }
    else if (cycle_p < 10) {
        $("#cycle").css("display", "flex");
        $("#cycle").css("width", cycle_p + "%");
    }
    else {
        $("#cycle").css("display", "flex");
        $("#cycle").css("width", cycle_p + "%");
        $("#cycle_value").text(cycle_p + "%");
    }

    if (forest_p == 0) {
        $("#forest").css("display", "none");
    }
    else if (forest_p < 10) {
        $("#forest").css("display", "flex");
        $("#forest").css("width", forest_p + "%");
    }
    else {
        $("#forest").css("display", "flex");
        $("#forest").css("width", forest_p + "%");
        $("#forest_value").text(forest_p + "%");
    }

    if (other_p == 0) {
        $("#other").css("display", "none");
    }
    else if (other_p < 10) {
        $("#other").css("display", "flex");
        $("#other").css("width", other_p + "%");
    }
    else {
        $("#other").css("display", "flex");
        $("#other").css("width", other_p + "%");
        $("#other_value").text(other_p + "%");
    }
    const rest_p = 100 - asphalt_p - cycle_p - forest_p - other_p; // procent niezdefiniowanych
    console.log("Rest_p: " + rest_p);
    if (rest_p > 10) {
        $("#rest_value").text(rest_p + "%");
        $("#rest").css("width", rest_p + "%");
    }
    else {
        $("#rest").css("width", rest_p + "%");
    }


    // Wyświetlanie przedziałek w wartościach na pasku:
    if (cycle_p > 0 || forest_p > 0 || other_p > 0) {
        $("#asphalt").css("border-right", "solid 2px black");
    }
    if (forest_p > 0 || other_p > 0) {
        $("#cycle").css("border-right", "solid 2px black");
    }
    if (other_p > 0) {
        $("#forest").css("border-right", "solid 2px black");
    }
    if (asphalt_p + cycle_p + forest_p + other_p != 100) {
        $("#rest").css("border-left", "solid 2px black");
    }

    // Wartość procentowa wyświetlana pod paskiem
    $("#asphalt_desc").text(asphalt_p + "%");
    $("#cycle_desc").text(cycle_p + "%");
    $("#forest_desc").text(forest_p + "%");
    $("#other_desc").text(other_p + "%");
    $("#rest_desc").text(rest_p + "%");

}



$(document).ready(function () {
    let isCreated = false;
    let startMarker;
    let endMarker;
    let length_global;
    let geojson; //narysowana trasa
    const pave_analyse = {
        sum_motorway: 0,
        sum_trunk: 0,
        sum_secondary: 0,
        sum_track: 0,
        sum_cycleway: 0,
        sum_other: 0,
        asphalt: 0,
        other: 0,
        forest: 0,
        cycle: 0
    };

    const pave_percent ={
        asphalt: 0,
        cycle: 0,
        forest: 0,
        other: 0,
        rest: 0,
        type: ""
    }

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

    /* Wstawka z Gridem i snapowaniem */

    let drawing = false;
    let editLayer = new L.LayerGroup();
    mymap.addLayer(editLayer);
    let roadsLayer;

    function setupVectorGrid() {
        if (roadsLayer) {
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
                        color: 'rgb(101, 67, 33, 0.8)',
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
            if (!drawing) {
                // Only trigger edit state if the edit layer button has been pressed!
                return false;
            }
            const layer = e.layer;
            const properties = layer.properties;
            const feature = drogi.features.find(f => f.properties.osm_id === properties.osm_id);

            if (feature) {
                const geo = new L.GeoJSON(feature, { pmIgnore: false });

                editLayer.addLayer(geo);
                mymap.removeLayer(editLayer);
                mymap.addLayer(editLayer);
            }
        });

        // Uaktualnianie legendy
        roadsLayer.bringToFront();
        const new_overlays = Object.assign({ "Drogi": roadsLayer }, overlays);
        mymap.addLayer(roadsLayer);
        ctlLayers.remove();
        overlays["Drogi"] = roadsLayer;
        ctlLayers = L.control.layers(basemaps, new_overlays).addTo(mymap);
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

    mymap.on('pm:globaleditmodetoggled', function ({ layer }) {
        console.log(layer);
        geojson = JSON.stringify(layer.toGeoJSON());
        console.log(geojson);
    });  //Przy naciśnięciu edytowania wyświetla się ta warstwa w konsoli?
    //KONIEC SNAPOWANIA

    // Liczenie długości
    mymap.on('pm:drawstart', ({ workingLayer }) => {
        length_global = 0;
        let last_vertex = {}
        workingLayer.on('pm:vertexadded', function ({ latlng }) {
            if (jQuery.isEmptyObject(last_vertex)) {
                $('.panel__length').text(`Długość trasy: 0 metrów.`);
                last_vertex.lat = latlng.lat;
                last_vertex.lng = latlng.lng;
            }
            else {
                console.log(workingLayer);
                turf_layer = []
                for (let i = 0; i < workingLayer["_latlngs"].length; i++) {
                    let coords = [];
                    coords.push(workingLayer["_latlngs"][i]["lng"]);
                    coords.push(workingLayer["_latlngs"][i]["lat"]);
                    turf_layer.push(coords);
                }
                turf_layer = turf.lineString(turf_layer);
                length_global = turf.length(turf_layer);
                length_global_fix = length_global.toFixed(2);
                console.log(turf_layer);

                $('.panel__length').text(`Długość trasy:  ${length_global_fix} km.`);
            }
        })
    });


    // Funkcja do wyświetlania dróg w zależności od zooma

    mymap.on('zoomend', function () {
        const zoomlevel = mymap.getZoom();
        if (zoomlevel < 15) {
            if (mymap.hasLayer(roadsLayer)) {
                mymap.removeLayer(roadsLayer);
            }
            else {
                console.log("The roads layer isn't active.")
            }
        }
        if (zoomlevel >= 15) {
            if (mymap.hasLayer(roadsLayer)) {
                console.log("Layer is already active.");
            }
            else {
                mymap.addLayer(roadsLayer);
            }
        }
    });

    // NAWIERZCHNIE - zapis
    const array = drogi['features'];
    let motorway = [];
    let trunk = [];
    let secondary = [];
    let track = [];
    let cycleway = [];
    let other = [];

    for (let i = 0; i < array.length; i++) {
        const coords = array[i]["geometry"]["coordinates"];
        const type = array[i]["properties"]["fclass"];
        switch (type) {
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
            case "unclassified":
            case "residential":
            case "service":
                secondary.push(coords);
                break;
            case "track":
            case "track_grade1":
            case "track_grade2":
            case "track_grade3":
            case "track_grade4":
            case "track_grade5":
            case "bridleway":
            case "path":
                track.push(coords);
                break;
            case "cycleway":
                cycleway.push(coords);
                break;
            case "living_street":  // ulica dla pieszych, może być kostka
            case "pedestrian":  // ulica dla pieszych, może być kostka
            case "footway": // chodnik dla pieszych, najprawdopodobniej kostka
                other.push(coords);
                break;
        }
    }

    // NAWIERZCHNIE - ANALIZA

    mymap.on('pm:create', ({ layer }) => {

        // Dodawanie znaczników startu i końca
        isCreated = true;
        const startCoords = [layer["_latlngs"][0]["lat"], layer["_latlngs"][0]["lng"]];
        const length = layer["_latlngs"].length;
        const endCoords = [layer["_latlngs"][length - 1]["lat"], layer["_latlngs"][length - 1]["lng"]]
        const start = L.icon.mapkey({ icon: "start", color: 'white', background: 'green', size: 10 });
        const end = L.icon.mapkey({ icon: "meta", color: 'white', background: 'red', size: 10 });
        startMarker = L.marker(startCoords, { icon: start }).addTo(mymap);
        endMarker = L.marker(endCoords, { icon: end }).addTo(mymap);

        editLayer.clearLayers();  // Czyścimy warstwę tymczasową ze snapowania

        // Narysowana droga - zamiana na LngLat

        const new_layer = turf.lineString(layer);
        coords = new_layer["geometry"]["coordinates"]["_latlngs"];
        let new_coords = [];

        for (let i = 0; i < coords.length; i++) {
            let element = [];
            element[0] = coords[i]["lng"];
            element[1] = coords[i]["lat"];
            new_coords.push(element);
        }
        draw_layer = turf.lineString(new_coords);


        // Sprawdzanie części wspólnych i obliczanie długości danej nawierzchni

        for (let i = 0; i < motorway.length; i++) {
            const line = turf.lineString(motorway[i][0]);
            const intersect = turf.lineOverlap(draw_layer, line);
            if (intersect['features'].length > 0) {
                console.log(intersect);
                pave_analyse.sum_motorway = parseFloat(pave_analyse.sum_motorway) + parseFloat(turf.length(intersect));

            }
        }
        for (let i = 0; i < trunk.length; i++) {
            const line = turf.lineString(trunk[i][0]);
            const intersect = turf.lineOverlap(draw_layer, line);
            if (intersect['features'].length > 0) {
                console.log(intersect);
                pave_analyse.sum_trunk = parseFloat(pave_analyse.sum_trunk) + parseFloat(turf.length(intersect));
            }
        }
        for (let i = 0; i < secondary.length; i++) {
            const line = turf.lineString(secondary[i][0]);
            const intersect = turf.lineOverlap(draw_layer, line);
            if (intersect['features'].length > 0) {
                console.log(intersect);
                pave_analyse.sum_secondary = parseFloat(pave_analyse.sum_secondary) + parseFloat(turf.length(intersect));
            }
        }
        for (let i = 0; i < track.length; i++) {
            const line = turf.lineString(track[i][0]);
            const intersect = turf.lineOverlap(draw_layer, line);
            if (intersect['features'].length > 0) {
                //Kod do wizualizacji
                //L.geoJSON(intersect, {color: 'green',opacity:0.6,lineCap:'butt'}).addTo(mymap);
                console.log(intersect);
                pave_analyse.sum_track = parseFloat(pave_analyse.sum_track) + parseFloat(turf.length(intersect));
            }
        }
        for (let i = 0; i < cycleway.length; i++) {
            const line = turf.lineString(cycleway[i][0]);
            const intersect = turf.lineOverlap(draw_layer, line);
            if (intersect['features'].length > 0) {
                console.log(intersect);
                pave_analyse.sum_cycleway = parseFloat(pave_analyse.sum_cycleway) + parseFloat(turf.length(intersect));
            }
        }
        for (let i = 0; i < other.length; i++) {
            const line = turf.lineString(other[i][0]);
            const intersect = turf.lineOverlap(draw_layer, line);
            if (intersect['features'].length > 0) {

                // Kod do wizualizacji co się zaliczyło (na bordowo)
                //L.geoJSON(intersect, {color: 'red',opacity:0.6,lineCap:'butt'}).addTo(mymap);

                console.log(intersect);
                for (let j = 0; j < intersect["features"].length; j++) {
                    let new_len = intersect["features"][j]["geometry"]["coordinates"];
                    new_len = turf.lineString(new_len);
                    console.log(new_len);
                    pave_analyse.sum_other = parseFloat(pave_analyse.sum_other) + parseFloat(turf.length(new_len));
                }
            }
        }

        //Sumowanie dróg do czterech głównych kategorii + weryfikacja w konsoli
        pave_analyse.asphalt = pave_analyse.sum_trunk + pave_analyse.sum_secondary;
        pave_analyse.other = pave_analyse.sum_other;
        pave_analyse.forest = pave_analyse.sum_track;
        pave_analyse.cycle = pave_analyse.sum_cycleway;

        console.log("Długość autostrad: " + pave_analyse.sum_motorway);
        console.log("Długość głównych: " + pave_analyse.sum_trunk);
        console.log("Długość podrzędnych: " + pave_analyse.sum_secondary);
        console.log("Długość pieszo-spokojnych: " + pave_analyse.sum_pedestrian);
        console.log("Długość leśnych: " + pave_analyse.sum_track);
        console.log("Długość ścieżek rowerowych: " + pave_analyse.sum_cycleway);
        console.log("Długość innych: " + pave_analyse.sum_other);

        console.log("ASFALT: " + pave_analyse.asphalt);
        console.log("INNE: " + pave_analyse.other);
        console.log("LAS: " + pave_analyse.forest);
        console.log("ROWEROWE: " + pave_analyse.cycle);

        // Potrzebne do JSONA - zapisu do bazy
        console.log(layer);
        geojson = JSON.stringify(layer.toGeoJSON());
        pave_output = JSON.stringify(pave_analyse);
        console.log(geojson);
    });


    // Funkcje używane po przesłaniu

    function changeToDetails() {
        // Zmiana zakładki na "Szczegóły"
        $("#tab2").removeClass("tab__active");
        $("#tab3").addClass("tab__active");
        $("#tab_li2").removeClass("tab__active");
        $("#tab_li3").addClass("tab__active");
        $("#route_length").text("Długość trasy:   " + length_global_fix + " km.");
    }
    function calculatePavement(pave_analyse) {

        // Obliczenia procentowej nawierzchni
        console.log("PRZED - asfalt: " + pave_analyse.asphalt + ", rower: " + pave_analyse.cycle + ", las: " + pave_analyse.forest + ", inne: " + pave_analyse.other + " DŁUGOŚĆ: " + length_global);
        asphalt_p = Math.round((pave_analyse.asphalt / length_global) * 100);
        cycle_p = Math.round((pave_analyse.cycle / length_global) * 100);
        forest_p = Math.round((pave_analyse.forest / length_global) * 100);
        other_p = Math.round((pave_analyse.other / length_global) * 100);
        console.log("asfalt: " + asphalt_p + ", rower: " + cycle_p + ", las: " + forest_p + ", inne: " + other_p);
        pave_percent.asphalt = asphalt_p;
        pave_percent.cycle = cycle_p;
        pave_percent.forest = forest_p;
        pave_percent.other = other_p;
        pave_percent.rest = 100 - asphalt_p - cycle_p - forest_p - other_p;
        if (pave_percent.asphalt > 80) {
            pave_percent.type = "asphalt";
        }
        else if (pave_percent.forest > 80) {
            pave_percent.type = "forest";
        }
        else {
            pave_percent.type = "mix";
        }
    }

   
    $(".panel__button--save").click(function () {
        //alert("");

        calculatePavement(pave_analyse);
        const route = {};
        route.Geometry = geojson;
        route.Name = $("#name").val();
        route.Description = $("#description").val();
        route.Asphalt = pave_percent.asphalt
        route.Cycle = pave_percent.cycle;
        route.Forest = pave_percent.forest;
        route.Other = pave_percent.other;
        route.Rest = pave_percent.rest;
        route.Type = pave_percent.type;
        route.Length = length_global;
        route.Difficulty = $('input[name=difficulty]:checked', '#form_route').val();
        console.log($('input[name=difficulty]:checked', '#form_route'));
        console.log(route.Difficulty);

        // Ulubiona
        if ($('#fav_route').is(":checked")) {
            route.Fav = true;
        }
        else {
            route.Fav = false;
        }

        var data = new Date();
        route.Date = data.toJSON();
        console.log("Data: " + route.Date);
        console.log(route);
        let name;
        let lastname;
        $.ajax({
            type: "POST",
            url: '/User/CreateRoute',
            data: JSON.stringify(route),
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (json) {
                console.log(json);
                alert("Sukces! Trasa została dodana :)");
                mymap.pm.removeControls();

                // Zmiana zakładki i wyświetlenie danych
                showPavement(pave_percent);
                changeToDetails();

                $("#route_length").text("  " + length_global_fix + " km.");
                name = json["name"];
                lastname = json["lastname"];
                $("#route_name").text("  " + route.Name);
                $("#route_user").text("  " + name + " " + lastname);
                $("#route_description").text("  " + route.Description);
                switch (route.Difficulty) {
                    case "easy":
                        $("#route_elevation").text("  Łatwy");
                        break;
                    case "medium":
                        $("#route_elevation").text("  Średni");
                        break;
                    case "hard":
                        $("#route_elevation").text("  Trudny");
                        break;
                }
                document.getElementById("form_route").reset();
            },
            error: function () {
                alert("Błąd przesyłania danych. Spróbuj ponownie.");
            }
        });
        return false;
    });

    // Resetowanie rysowanej warstwy widocznej na mapie

    $("#tab_li1").click(function () {
        if (isCreated) {
            $("#tab_li3").removeClass("tab__active");
            $("#tab3").removeClass("tab__active");
            let drawn = mymap.pm.getGeomanDrawLayers(false);
            for (let i = 0; i < drawn.length; i++) {
                drawn[i].removeFrom(mymap);
            }
            length_global = 0;
            length_global_fix = 0;
            $('.panel__length').text(`Długość trasy:  ${length_global_fix} km.`);
            startMarker.remove();
            endMarker.remove();
            editLayer.clearLayers();
            editLayer.remove();
            editLayer.addTo(mymap);
            rest_p = 0;
        }
    });

    $("#tab_li2").click(function () {
        if (isCreated) {
            $("#tab_li3").removeClass("tab__active");
            $("#tab3").removeClass("tab__active");
            let drawn = mymap.pm.getGeomanDrawLayers(false);
            for (let i = 0; i < drawn.length; i++) {
                drawn[i].removeFrom(mymap);
            }
            length_global = 0;
            length_global_fix = 0;
            $('.panel__length').text(`Długość trasy:  ${length_global_fix} km.`);
            startMarker.remove();
            endMarker.remove();
            editLayer.clearLayers();
            editLayer.remove();
            editLayer.addTo(mymap);
            rest_p = 0;
        }
    });

});