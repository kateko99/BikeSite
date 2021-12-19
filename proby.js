/*
    Ładowanie mapy z ESRI:

    lyrRoads = L.esri.Vector.vectorTileLayer("https://vectortileservices2.arcgis.com/MzCtPDSne0rpIt7V/arcgis/rest/services/wyzyna_roads2/VectorTileServer").addTo(mymap); 
    */

    // Próba ładowania z plugina leaflet-geojson-vt
    //var geojson = L.geoJSON('data/drogi2.geojson');

    /*
    A to chyba przez moment działało:
    var options = {
        maxZoom: 16,
        tolerance: 3,
        debug: 0,
        style: {
            color: '#F2FF00'
        }
    };
    var canvasLayer = L.gridLayer.geoJson('data/drogi.geojson', options).addTo(mymap);
*/


/* VECTOR TILED LAYER - zwykłe proste stylowanie, działa:

    
        vectorTileLayerStyles: {
          sliced: {
            color: "brown",
            weight:3,
            opacity:0.7
          }
        }, 
*/

/* MARKER - Dominika
    
    var marker = L.marker([50.071594297118544, 19.92222185367304]).addTo(mymap);
*/


/* DRAW - próba (nie wiem czy działa)

    var drawnItems = new L.FeatureGroup();
    mymap.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        edit: {
                featureGroup: drawnItems
            }
    });
    mymap.addControl(drawControl);

*/

/*

    NIEUDANE PRÓBY Z FEATURE LAYER:

    lyrRoads = L.esri.featureLayer("https://services2.arcgis.com/MzCtPDSne0rpIt7V/arcgis/rest/services/Wyzyna_drogi_feature/FeatureServer").addTo(mymap);

    lyrRoads = L.esri.featureLayer({
    url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/MapServer/0'
  }).addTo(mymap);

 
    lyrRoads = L.esri.featureLayer("https://services2.arcgis.com/MzCtPDSne0rpIt7V/arcgis/rest/services/Wyzyna_drogi_feature/FeatureServer",
        style: (feature) => {
            return {
              color: "#BA55D3",
            };
    }}).addTo(mymap);

    console.log(lyrRoads);

    lyrRoads = L.esri.featureLayer({
        url: "https://services2.arcgis.com/MzCtPDSne0rpIt7V/arcgis/rest/services/Wyzyna_drogi_feature/FeatureServer"
    }).addTo(mymap);  
*/


/* Dodawanie warstwy wyżyny w tradycyjny sposób, z plikiem .geojson, przez ajax (to nie działało w Vsual Studio )

lyrBoundary = L.geoJSON.ajax("/data/wyzyna.geojson").addTo(mymap);

*/
