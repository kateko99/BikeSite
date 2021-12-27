let mymap;
let lyrOSM;
let lyrTopo, lyrImagery, lyrWatercolor;
let lyrRoads;
let lyrBoundary;
let basemaps, overlays;
    
$(document).ready(function() {
    mymap = L.map('mapid', {center: [50.2071, 19.8290], zoom: 12});
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
            sliced: function(properties, zoom) {
                var fclass = properties.fclass;
                var weight = 1;
                var color = 'blue';
                switch(fclass) {
                    case 'motorway':        //autostrady
                        weight=3,
                        color='red';
                        break;
                    case 'trunk':       //główne, szybkiego ruchu
                        weight=4,
                        color='red'
                    case 'primary':     //pierwszorzędne
                        weight=3,
                        color='orange';
                        break;
                    case 'secondary':       //drugorzędne
                        weigh=4,
                        color='yellow';
                        break;
                    case 'teritary':        //łączące np.miasteczka, wsie
                        weight=2,
                        color='brown';
                        break;
                    case 'unclassified':    //też łączące wsie, jeszcze mnejsze
                        weight:2,
                        color='darkpink';
                        break;
                    case 'residential':
                        weight=2,
                        color="58006B"
                    case'service':     //dojazdowe np.do domu, na terenie firmy
                        weight=2,
                        color="#AA336A";
                        break;
                    case 'footway':
                        weight=2,
                        color="#0F7207";
                        break;
                    case 'track_grade1':
                    case 'track_grade2':
                        weight=3,
                        color='green'
                }
                return  {
                    weight: weight,
                    color: color,
                    opacity:0.7
                }
            }
        },
        maxZoom: 22,
        indexMaxZoom: 5,       // max zoom in the initial tile index
        interactive: true,
        getFeatureId: function(feature) {
                return feature.properties["fclass"]
        }
    }).addTo(mymap);

    // Stylowanie warstw:
    var boundaryStyle = {
        "weight": 5,
        "fillOpacity": 0.15
    };
    var cafeStyle = {
    }
    var castleStyle = {
    }
    var archeoStyle = {
    }
    var attractionStyle = {
    }
    var memorialStyle = {
    }
    var museumStyle = {
    }
    var restaurantStyle = {
    }
    var shopStyle = {
    }
    var toiletStyle = {
    }
    var touristStyle = {
    }
    var towerStyle = {
    }

    // Dodawanie warstw:
    lyrBoundary = L.geoJSON(wyzyna, {
        style: boundaryStyle
    }).addTo(mymap);
    lyrCafe = L.geoJSON(cafe, {
        style: cafeStyle
    }).addTo(mymap);
    lyrCastle = L.geoJSON(castle, {
        style: castleStyle
    }).addTo(mymap);
    lyrArcheo = L.geoJSON(archeo, {
        style: archeoStyle
    }).addTo(mymap);
    lyrAttraction = L.geoJSON(attraction, {
        style: attractionStyle
    }).addTo(mymap);
    lyrMemorial = L.geoJSON(memorial, {
        style: memorialStyle
    }).addTo(mymap);
    lyrMuseum = L.geoJSON(museum, {
        style: museumStyle
    }).addTo(mymap);
    lyrRestaurant = L.geoJSON(restaurant, {
        style: restaurantStyle
    }).addTo(mymap);
    lyrShop = L.geoJSON(shop, {
        style: shopStyle
    }).addTo(mymap);
    lyrToilet = L.geoJSON(toilet, {
        style: toiletStyle
    }).addTo(mymap);
    lyrTourist = L.geoJSON(tourist_info, {
        style: touristStyle
    }).addTo(mymap);
    lyrTower = L.geoJSON(tower, {
        style: towerStyle
    }).addTo(mymap);
    


    // Tworzenie menu z warstwami
    basemaps = {
        "Open Street Map": lyrOSM,
        "Topography" : lyrTopo,
        "Satelita" : lyrImagery,
        "Watercolor" : lyrWatercolor
    }

    overlays = {
        "Granica Wyżyny" : lyrBoundary,
        "Drogi" : roadsLayer,
        "Kawiarnie" : lyrCafe,
        "Zamki" : lyrCastle,
        "Obiekty archeologiczne" : lyrArcheo,
        "Obiekty pamięci" : lyrMemorial,
        "Atrakcje" : lyrAttraction,
        "Muzeum" : lyrMuseum,
        "Restaurancje" : lyrRestaurant,
        "Sklepy" : lyrShop,
        "Toalety" : lyrToilet,
        "Informacja turystyczna" : lyrTourist,
        "Wieża" : lyrTower
    }

    ctlLayers = L.control.layers(basemaps, overlays).addTo(mymap);

    // Funkcja do wyświetlania dróg w zależności od zooma
    
    mymap.on('zoomend', function() {
        var zoomlevel = mymap.getZoom();
        if(zoomlevel<12) {
            if(mymap.hasLayer(roadsLayer)) 
            {
                mymap.removeLayer(roadsLayer);
            }
            else {
                console.log("The roads layer isn't active.")
            }
        }
        if(zoomlevel >=12) {
            if(mymap.hasLayer(roadsLayer)) {
                console.log("Layer is already active.");
            }
            else {
                mymap.addLayer(roadsLayer);
            }
        }
    });
    
});

