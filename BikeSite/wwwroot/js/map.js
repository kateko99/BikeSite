let mymap;
let lyrOSM;
let lyrTopo, lyrImagery, lyrWatercolor;
let lyrRoads;
let lyrBoundary;
let basemaps, overlays;

$(document).ready(function () {
    mymap = L.map('mapid', { center: [50.2071, 19.8120], zoom: 13, minZoom: 5, maxZoom: 30 });
    lyrOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        maxNativeZoom: 18,
        maxZoom: 30
    });
    lyrTopo = L.tileLayer.provider('OpenTopoMap', {
        maxNativeZoom: 17,
        maxZoom: 30
    });
    lyrImagery = L.tileLayer.provider('Esri.WorldImagery', {
        maxNativeZoom: 18,
        maxZoom: 30
    });
    lyrWatercolor = L.tileLayer.provider('Stamen.Watercolor', {
        maxNativeZoom: 15,
        maxZoom: 30
    });
    mymap.addLayer(lyrOSM);

    console.log(lyrImagery);


    // Stylowanie warstw:
    var boundaryStyle = {
        "weight": 5,
        "fillColor": 'black',
        "fillOpacity": 0.3,
        "color": "black",
        "weight": 2,
    };

    function cafeStyle(json, latlng) {

        const att = json.properties;
        let text;
        if (att.name === null) {
            let type;
            if (att.fclass == 'bakery') { type = "Piekarnia" }
            else { type = "Kawiarnia" }
            text = type;
        }
        else {
            text = att.name;
        }
        const cafeIcon = L.icon.mapkey({ icon: "heart", color: 'white', background: 'hotpink', size: 30 });
        return L.marker(latlng, { icon: cafeIcon }).bindTooltip("<h4>" + text + "</h4>", { className: 'map__tooltip' });
    }

    function castleStyle(json, latlng) {
        const att = json.properties;
        const castleIcon = L.icon.mapkey({ icon: "castle", color: 'white', background: 'brown', size: 30 });
        return L.marker(latlng, { icon: castleIcon }).bindTooltip("<h4>" + att.name + "</h4>");
    }

    function archeoStyle(json, latlng) {
        const att = json.properties;
        let type, name;
        switch (att.fclass) {
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
        if (att.name === null) { name = "" }
        else { name = att.name }
        const archeoIcon = L.icon.mapkey({ icon: "ruins", color: 'white', background: 'black', size: 30 });
        return L.marker(latlng, { icon: archeoIcon }).bindTooltip(type + "</br><h4>" + name + "</h4>");
    }

    function attractionStyle(json, latlng) {
        const att = json.properties;
        const attractionIcon = L.icon.mapkey({ icon: "windmill", color: 'white', background: '#F4BB44', size: 30 });
        let marker;
        if (att.name === null) {
            marker = L.marker(latlng, { icon: attractionIcon });
        }
        else {
            marker = L.marker(latlng, { icon: attractionIcon }).bindTooltip("<h4>" + att.name + "</h4>")
        }
        return marker;
    }

    function memorialStyle(json, latlng) {
        const att = json.properties;
        const memorialIcon = L.icon.mapkey({ icon: "memorial", color: 'white', background: 'yellow', size: 30 });
        return L.marker(latlng, { icon: memorialIcon }).bindTooltip("<h4>" + att.name + "</h4>");
    }

    function museumStyle(json, latlng) {
        const att = json.properties;
        let name;
        if (att.name === null) { name = "" }
        else { name = att.name }
        const museumIcon = L.icon.mapkey({ icon: "museum", color: 'white', background: 'black', size: 30 });
        return L.marker(latlng, { icon: museumIcon }).bindTooltip("Muzeum" + "</br><h4>" + name + "</h4>");
    }
    function restaurantStyle(json, latlng) {
        const att = json.properties;
        let type, name;
        switch (att.fclass) {
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
        if (att.name === null) { name = "" }
        else { name = att.name }
        const restaurantIcon = L.icon.mapkey({ icon: "restaurant", color: 'white', background: 'green', size: 30 });
        return L.marker(latlng, { icon: restaurantIcon }).bindTooltip(type + "</br><h4>" + name + "</h4>");
    }
    function shopStyle(json, latlng) {
        const att = json.properties;
        let type, name;
        switch (att.fclass) {
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
        if (att.name === null) { name = "" }
        else { name = att.name }
        const shopIcon = L.icon.mapkey({ icon: "supermarket", color: 'white', background: 'lightskyblue', size: 30 });
        return L.marker(latlng, { icon: shopIcon }).bindTooltip(type + "</br><h4>" + name + "</h4>");
    }

    function toiletStyle(json, latlng) {
        const toiletIcon = L.icon.mapkey({ icon: "toilet", color: 'white', background: 'silver', size: 30 });
        return L.marker(latlng, { icon: toiletIcon });
    }

    function touristStyle(json, latlng) {
        var touristIcon = L.icon.mapkey({ icon: "info", color: 'white', background: 'purple', size: 30 });
        return L.marker(latlng, { icon: touristIcon });
    }
    function towerStyle(json, latlng) {
        const att = json.properties;
        let name;
        if (att.name === null) { name = "" }
        else { name = att.name }
        const towerIcon = L.icon.mapkey({ icon: "tower", color: 'white', background: 'brown', size: 30 });
        return L.marker(latlng, { icon: towerIcon }).bindTooltip("Wieża" + "</br><h4>" + name + "</h4>");
    }

    // Funkcje OnEachFeture


    // Dodawanie warstw:
    lyrBoundary = L.geoJSON(maska, {
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
        "Topography": lyrTopo,
        "Satelita": lyrImagery,
        "Watercolor": lyrWatercolor
    }

    overlays = {
        "Granica Wyżyny": lyrBoundary,
        "Kawiarnie": lyrCafe,
        "Zamki": lyrCastle,
        "Obiekty archeologiczne": lyrArcheo,
        "Obiekty pamięci": lyrMemorial,
        "Atrakcje": lyrAttraction,
        "Muzeum": lyrMuseum,
        "Restaurancje": lyrRestaurant,
        "Sklepy": lyrShop,
        "Toalety": lyrToilet,
        "Informacja turystyczna": lyrTourist,
        "Wieża": lyrTower
    }

    ctlLayers = L.control.layers(basemaps, overlays).addTo(mymap);

});


