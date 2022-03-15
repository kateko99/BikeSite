let searchLayer = new L.LayerGroup();
let markers = new L.LayerGroup();
let layerData = [];
let newLayer = [];

$("#search_submit").on("click", function (e) {
    e.preventDefault();
    const search_obj = {}
    search_obj.Length = $("#search_len").val()[0];
    search_obj.Difficulty = $('#search_dif').val()[0];
    search_obj.Pavement = $('#search_pav').val()[0];
    console.log(search_obj);

    $.ajax({
        type: "POST",
        url: '/User/SearchRoutes',
        data: JSON.stringify(search_obj),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            alert("Sukces! Wyniki wyszukiwania zaktualizowane zostały na mapie.");
            searchLayer.clearLayers();
            markers.clearLayers();
            if (mymap.hasLayer(searchLayer)) {
                mymap.removeLayer(searchLayer);
            }
            if (mymap.hasLayer(markers)) {
                mymap.removeLayer(markers);
            }
            const obj = JSON.parse(response);
            console.log(obj);
            let geometry;
            for (let i = 0; i < obj.length; i++) {
                layerData[i] = obj[i];
                console.log(layerData[i]);
                geometry = obj[i]["Geometry"];
                const geo = JSON.parse(geometry);
                geo["properties"]["id"] = i;
                console.log(geo);
                newLayer[i] = L.geoJSON(geo, {
                });

                const startCoords = [geo["geometry"]["coordinates"][0][1], geo["geometry"]["coordinates"][0][0]];
                const length = geo["geometry"]["coordinates"].length;
                const endCoords = [geo["geometry"]["coordinates"][length - 1][1], geo["geometry"]["coordinates"][length - 1][0]];
                const start = L.icon.mapkey({ icon: "start", color: 'white', background: 'green', size: 10 });
                const end = L.icon.mapkey({ icon: "meta", color: 'white', background: 'red', size: 10 });
                const startMarker = L.marker(startCoords, { icon: start });
                const endMarker = L.marker(endCoords, { icon: end });
                markers.addLayer(startMarker);
                markers.addLayer(endMarker);
                searchLayer.addLayer(newLayer[i]);
            }
            mymap.addLayer(searchLayer);
            mymap.addLayer(markers);

            
            searchLayer.eachLayer(function (layer) {
                layer.on('click', function () {
                    console.log(layer);
                    const leaflet_id = layer["_leaflet_id"] - 1;
                    console.log(typeof (leaflet_id));
                    const id = layer["_layers"][leaflet_id]["feature"]["properties"]["id"];
                    console.log(id);
                    const data = layerData[id];
                    console.log(data);

                    // Ustawianie nawierzchni
                    const pave_data = {
                        asphalt: data["Asphalt"],
                        cycle: data["Cycle"],
                        forest: data["Forest"],
                        other: data["Other"],
                        rest: data["Rest"],
                        type: data["Type"]
                    }
                    showPavement(pave_data);

                    //Zmiana zakładki
                    $("#tab1").removeClass("tab__active");
                    $("#tab3").addClass("tab__active");
                    $("#tab_li1").removeClass("tab__active");
                    $("#tab_li3").addClass("tab__active");
                    $("#route_length").text(data["Length"].toFixed(2) + " km.");

                    //name = json["name"];
                    //lastname = json["lastname"];
                    $("#route_name").text("  " + data["Name"]);
                    $("#route_user").css("display", "none");
                    $("#user_header").css("display", "none");
                    $("#user_space").css("display", "none");
                    $("#route_description").text("  " + data["Description"]);
                    switch (data["Difficulty"]) {
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
                });
            });          
        },
        error: function (response) {
            alert("Błąd przesyłania danych. Spróbuj ponownie.");
        }
    });
});  