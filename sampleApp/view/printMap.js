/*
Author: Tu Hoang
ESRGC 2014 
CBCA

base map view using backbone.js
element: '.map'
renders map for printing

*/

app.View.PrintMap = app.View.Map.extend({
  name: 'MapView',
  initialize: function() {

  },
  render: function(callback) {
    this.makeMap();
    this.loadMapData(callback);
  },
  makeMap: function() {
    var scope = this;
    this.mapViewer = new app.CriticalAreaViewer({
      onMapZoomEnd: function(mapViewer) {
        var map = mapViewer.map;
        var countyLayer = mapViewer.geoJsonFeatures;
        var zoomLvl = map.getZoom();
        if (scope.selectedLayer != null) {
          if (zoomLvl >= 10) {
            map.removeLayer(countyLayer);//county layer
          }
          else {
            map.addLayer(countyLayer);//county layer
          }
        }
      }
    });
  }
  
});