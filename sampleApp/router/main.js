/*
Author: Tu Hoang
ESRGC 2014

Router
main.js

provides routes for cbca app

*/

app.Router.Main = Backbone.Router.extend({
  name: 'Main',
  routes: {
    '': 'init',
    'home': 'home',
    'search': 'search',
    'instruction': 'instruction',
    'legend': 'legend',
    'share': 'share',
    'print': 'print',
    'identify/:county/:lat/:lng': 'identify',
    'findAddress/:county/:address': 'findAddress',
    'findAccountID/:county/:accountID': 'findAccountID',
    'findParcel/:county/:map/:parcel': 'findParcel'
  },
  init: function() {
    this.loadMap();
    console.log('Start up route run!');
  },
  home: function() {
    this.loadMap();
    var sb = app.getSidebar();
    if (sb != null) {
      sb.open('home')
    }
  },
  search: function() {
    this.loadMap();
    var sb = app.getSidebar();
    if (sb != null) {
      sb.open('search')
    }
  },
  instruction: function() {
    this.loadMap();
    var sb = app.getSidebar();
    if (sb != null) {
      sb.open('instruction')
    }
  },
  legend: function() {
    this.loadMap();
    var sb = app.getSidebar();
    if (sb != null) {
      sb.open('legend')
    }
  },
  share: function() {
    this.loadMap();
    var sb = app.getSidebar();
    if (sb != null) {
      sb.open('share')
    }
  },
  print: function() {
    this.loadMap();
    var sb = app.getSidebar();
    if (sb != null) {
      sb.open('print')
    }
  },
  identify: function(county, lat, lng) {
    this.loadMap(function() {
      var mapView = app.getViewByName('MapView');
      mapView.selectCountyByName(county);
      if (typeof mapView.selectedLayer != 'undefined') {
        //zoom to point
        mapView.mapViewer.zoomToXY(lng, lat, 15);
        var dlayer = mapView.mapViewer.getDynamicLayer();
        dlayer.on('load', function() {
          mapView.identify(L.latLng(lat, lng));
          dlayer.clearAllEventListeners();
        });
      }
      //store hash for printing
      mapView.actionHash = location.hash.replace('#', '');
      //update email link
      app.getView('Share').updateEmailLink(mapView.actionHash);
    });

  },
  findAddress: function(county, address) {
    this.loadMap(function() {
      var mapView = app.getViewByName('MapView');
      mapView.selectCountyByName(county);
      if (typeof mapView.selectedLayer != 'undefined') {
        mapView.findAddress(address);
      }
      //store hash for printing
      mapView.actionHash = location.hash.replace('#', '');
      //update email link
      app.getView('Share').updateEmailLink(mapView.actionHash);
    });

  },
  findAccountID: function(county, accountID) {
    this.loadMap(function() {
      var mapView = app.getViewByName('MapView');
      mapView.selectCountyByName(county);
      if (typeof mapView.selectedLayer != 'undefined') {
        mapView.findAcctID(accountID);
      }
      //store hash for printing
      mapView.actionHash = location.hash.replace('#', '');
      //update email link
      app.getView('Share').updateEmailLink(mapView.actionHash);
    });

  },
  findParcel: function(county, map, parcel) {
    this.loadMap(function() {
      var mapView = app.getViewByName('MapView');
      mapView.selectCountyByName(county);
      if (typeof mapView.selectedLayer != 'undefined') {
        mapView.findTaxID(map, parcel);
      }
      //store hash for printing
      mapView.actionHash = location.hash.replace('#', '');
      //update email link
      app.getView('Share').updateEmailLink(mapView.actionHash);
    });

  },
  loadMap: function(cb) {
    var mapView = app.getViewByName('MapView');
    //for print page
    $('#btn-print').on('click', function() {
      window.print();
    });

    if (!mapView.isRendered)//if map hasn't been loaded, then call render to do so
      mapView.render(cb);
    else {
      if (typeof cb == 'function')
        cb.call(this);//call callback here if map is already loaded
    }
  }

});