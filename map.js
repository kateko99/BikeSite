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


    console.log("(l. 84) Drogi: ");
    console.log(roadsLayer);


    // Stylowanie warstw:
    var boundaryStyle = {
        "weight": 5,
        "fillOpacity": 0.15
    };

    function cafeStyle(json, latlng) {

        var att = json.properties;
        var text;
        if(att.name === null) {
            var type;
            if(att.fclass == 'bakery') {type = "Piekarnia"}
            else {type="Kawiarnia"}
            text = type;
        }
        else {
            text = att.name;
        }
        var cafeIcon = L.icon.mapkey({icon:"",color:'white',background:'green',size: 30});
        return L.marker(latlng, {icon: cafeIcon}).bindTooltip("<h4>" + text + "</h4>", {className: 'map__tooltip'});
    }

    function castleStyle(json, latlng) {
        var att = json.properties;
        var castleIcon = L.icon.mapkey({icon:"castle",color:'white',background:'brown', size: 30});
        return L.marker(latlng, {icon: castleIcon}).bindTooltip("<h4>" + att.name + "</h4>");
    }

    function archeoStyle(json, latlng) {
        var att = json.properties;
        var type, name;
        switch(att.fclass){
            case 'ruins':
                type = "Ruiny";
                break;
            case 'fort':
                type = "Fort"
                break;
            case 'archaeological':
                type = "Zabytek archeologiczny"
                break;
            default:
                type = ""
        }
        if(att.name === null) {name = ""}
        else {name = att.name}
        var archeoIcon = L.icon.mapkey({icon:"ruins",color:'white',background:'black',size: 30});
        return L.marker(latlng, {icon: archeoIcon}).bindTooltip(type + "</br><h4>" + name + "</h4>");
    }

    function attractionStyle(json, latlng) {
        var att = json.properties;
        var attractionIcon = L.icon.mapkey({icon:"windmill",color:'white',background:'orange', size: 30});
        var marker;
        if(att.name === null) {
            marker = L.marker(latlng, {icon: attractionIcon});
        }
        else {
            marker = L.marker(latlng, {icon: attractionIcon}).bindTooltip("<h4>"+ att.name +"</h4>")
        }       
        return marker;
    }

    function memorialStyle(json, latlng) {
        var att = json.properties;
        var memorialIcon = L.icon.mapkey({icon:"memorial",color:'white',background:'yellow',size:30});
        return L.marker(latlng, {icon: memorialIcon}).bindTooltip("<h4>" + att.name + "</h4>");
    }

    function museumStyle(json, latlng) {
        var att = json.properties;
        var name;
        if(att.name === null) {name = ""}
        else {name = att.name}
        var museumIcon = L.icon.mapkey({icon:"museum",color:'white',background:'black',size:30});
        return L.marker(latlng, {icon: museumIcon}).bindTooltip("Muzeum" + "</br><h4>" + name + "</h4>");
    }
    function restaurantStyle(json, latlng) {
        var att = json.properties;
        var type, name;
        switch(att.fclass){
            case 'restaurant':
                type = "Restauracja";
                break;
            case 'fast_food':
                type = "Fast-food"
                break;
            case 'bar':
                type = "Bar"
                break;
            default:
                type = ""
        }
        if(att.name === null) {name = ""}
        else {name = att.name}
        var restaurantIcon = L.icon.mapkey({icon:"restaurant",color:'white',background:'blue',size:30});
        return L.marker(latlng, {icon: restaurantIcon}).bindTooltip(type + "</br><h4>" + name + "</h4>");
    }
    function shopStyle(json, latlng) {
        var att = json.properties;
        var type, name;
        switch(att.fclass){
            case 'supermarket':
                type = "Supermarket";
                break;
            case 'mall':
                type = "Centrum handlowe"
                break;
            case 'convenience':
                type = "Sklep spożywczy"
                break;
            case 'market_place':
                type = "Targowisko";
                break;
            default:
                type = ""
        }
        if(att.name === null) {name = ""}
        else {name = att.name}
        var shopIcon = L.icon.mapkey({icon:"supermarket", color:'white',background:'pink',size:30});
        return L.marker(latlng, {icon: shopIcon}).bindTooltip(type + "</br><h4>" + name + "</h4>");
    }

    function toiletStyle(json, latlng) {
        var att = json.properties;
        var toiletIcon = L.icon.mapkey({icon:"toilet",color:'white',background:'red',size: 30});
        return L.marker(latlng, {icon: toiletIcon});
    }

    function touristStyle(json, latlng) {
        var att = json.properties;
        var touristIcon = L.icon.mapkey({icon:"info",color:'white',background:'purple',size: 30});
        return L.marker(latlng, {icon: touristIcon});
    }
    function towerStyle(json, latlng) {
        var att = json.properties;
        var name;
        if(att.name === null) {name = ""}
        else {name = att.name}
        var towerIcon = L.icon.mapkey({icon:"tower",color:'white',background:'brown',size: 30});
        return L.marker(latlng, {icon: towerIcon}).bindTooltip("Wieża" + "</br><h4>" + name + "</h4>");
    }

    // Funkcje OnEachFeture


    // Dodawanie warstw:

    lyrBoundary = L.geoJSON(wyzyna, {
        style: boundaryStyle
    }).addTo(mymap);
    
    lyrCafe = L.geoJSON(cafe, {
        pointToLayer: cafeStyle,
    }).addTo(mymap);
    console.log("(l 117) Kawiarnie: ");
    console.log(lyrCafe);

    lyrCastle = L.geoJSON(castle, {
        pointToLayer: castleStyle
    }).addTo(mymap);
    lyrArcheo = L.geoJSON(archeo, {
        pointToLayer: archeoStyle
    }).addTo(mymap);
    lyrAttraction = L.geoJSON(attraction, {
        pointToLayer: attractionStyle
    }).addTo(mymap);
    lyrMemorial = L.geoJSON(memorial, {
        pointToLayer: memorialStyle
    }).addTo(mymap);
    lyrMuseum = L.geoJSON(museum, {
        pointToLayer: museumStyle
    }).addTo(mymap);
    lyrRestaurant = L.geoJSON(restaurant, {
        pointToLayer: restaurantStyle
    }).addTo(mymap);
    lyrShop = L.geoJSON(shop, {
        pointToLayer: shopStyle
    }).addTo(mymap);
    lyrToilet = L.geoJSON(toilet, {
        pointToLayer: toiletStyle
    }).addTo(mymap);
    lyrTourist = L.geoJSON(tourist_info, {
        pointToLayer: touristStyle
    }).addTo(mymap);
    lyrTower = L.geoJSON(tower, {
        pointToLayer: towerStyle
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

});

