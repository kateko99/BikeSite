let mymap;
let lyrOSM;
let lyrTopo, lyrImagery, lyrWatercolor;
let lyrRoads;
let lyrBoundary;
let basemaps, overlays;

$(document).ready(function () {
    mymap = L.map('mapid', { center: [50.2071, 19.8290], zoom: 12 });
    lyrOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
    lyrTopo = L.tileLayer.provider('OpenTopoMap');
    lyrImagery = L.tileLayer.provider('Esri.WorldImagery');
    lyrWatercolor = L.tileLayer.provider('Stamen.Watercolor');
    mymap.addLayer(lyrOSM);

    console.log(lyrImagery);

    // Dodawanie i stylowanie wastwy dróg

    var roadsLayer = L.vectorGrid.slicer(drogi, {
        rendererFactory: L.canvas.tile,

        vectorTileLayerStyles: {
            sliced: function (properties, zoom) {
                var fclass = properties.fclass;
                var weight = 1;
                var color = 'blue';
                switch (fclass) {
                    case 'motorway':        //autostrady
                        weight = 3,
                            color = 'red';
                        break;
                    case 'trunk':       //główne, szybkiego ruchu
                        weight = 4,
                            color = 'red'
                    case 'primary':     //pierwszorzędne
                        weight = 3,
                            color = 'orange';
                        break;
                    case 'secondary':       //drugorzędne
                        weigh = 4,
                            color = 'yellow';
                        break;
                    case 'teritary':        //łączące np.miasteczka, wsie
                        weight = 2,
                            color = 'brown';
                        break;
                    case 'unclassified':    //też łączące wsie, jeszcze mnejsze
                        weight: 2,
                            color = 'darkpink';
                        break;
                    case 'residential':
                        weight = 2,
                            color = "58006B"
                    case 'service':     //dojazdowe np.do domu, na terenie firmy
                        weight = 2,
                            color = "#AA336A";
                        break;
                    case 'footway':
                        weight = 2,
                            color = "#0F7207";
                        break;
                    case 'track_grade1':
                    case 'track_grade2':
                        weight = 3,
                            color = 'green'
                }
                return {
                    weight: weight,
                    color: color,
                    opacity: 0.7
                }
            }
        },
        maxZoom: 22,
        indexMaxZoom: 5,       // max zoom in the initial tile index
        interactive: true,
        getFeatureId: function (feature) {
            return feature.properties["fclass"]
        }
    }).addTo(mymap);

    // Dodawanie i stylowanie warstwy granic
    var boundaryStyle = {
        "weight": 5,
        "fillOpacity": 0.15
    };
    lyrBoundary = L.geoJSON(wyzyna, {
        style: boundaryStyle
    }).addTo(mymap);


    // Tworzenie menu z warstwami
    basemaps = {
        "Open Street Map": lyrOSM,
        "Topography": lyrTopo,
        "Satelita": lyrImagery,
        "Watercolor": lyrWatercolor
    }

    overlays = {
        "Granica Wyżyny": lyrBoundary,
        "Drogi": roadsLayer
    }

    ctlLayers = L.control.layers(basemaps, overlays).addTo(mymap);

    // Funkcja do wyświetlania dróg w zależności od zooma

    mymap.on('zoomend', function () {
        var zoomlevel = mymap.getZoom();
        if (zoomlevel < 12) {
            if (mymap.hasLayer(roadsLayer)) {
                mymap.removeLayer(roadsLayer);
            }
            else {
                console.log("The roads layer isn't active.")
            }
        }
        if (zoomlevel >= 12) {
            if (mymap.hasLayer(roadsLayer)) {
                console.log("Layer is already active.");
            }
            else {
                mymap.addLayer(roadsLayer);
            }
        }
    });

});


