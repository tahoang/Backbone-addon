/*
Author: Tu Hoang
ESRGC 2014 

CBCA

Search view using backbone.js
element: '.sidebar-pane#search'
renders Search for cbca

*/

app.View.Search = Backbone.View.extend({
  name: 'Search',
  el: '.sidebar-pane#search',
  events: {
    'submit form#form-address': 'onAddressBtnClick',
    'submit form#form-accountID': 'onAcctIDBtnClick',
    'submit form#form-taxID': 'onTaxIDBtnClick'
  },
  initialize: function() {
    this.$('form#form-address').validate({ debug: true });
    this.$('form#form-accountID').validate({ debug: true });
    this.$('form#form-taxID').validate({ debug: true });
  },
  render: function() {

  },
  onAddressBtnClick: function(e) {
    scope = this;
    var address = scope.$('#txt-address').val();
    console.log(address);
    var mapView = app.getViewByName('MapView');
    
    if (typeof mapView.selectedLayer != 'undefined') {
      mapView.findAddress(address);
    }
    var router = app.getRouter('Main');
    var path = 'findAddress/' + mapView.selectedLayerName + '/' + address;
    router.navigate(path, { trigger: false });
    mapView.actionHash = path;

    //update email link
    app.getView('Share').updateEmailLink(path);
    return false;
  },
  onAcctIDBtnClick: function(e) {
    scope = this;
    var accountID = scope.$('#txt-accountID').val();
    console.log(accountID);
    var mapView = app.getViewByName('MapView');
    if (typeof mapView.selectedLayer != 'undefined') {
      mapView.findAcctID(accountID);
    }
    var router = app.getRouter('Main');
    var path = 'findAccountID/' + mapView.selectedLayerName + '/' + accountID;
    router.navigate(path, { trigger: false });
    mapView.actionHash = path;
    //update email link
    app.getView('Share').updateEmailLink(path);
    return false;
  },
  onTaxIDBtnClick: function(e) {
    scope = this;
    var mapID = scope.$('#txt-mapID').val();
    console.log(mapID);

    var parcelNo = scope.$('#txt-parcelNo').val()
    console.log(parcelNo);

    var mapView = app.getViewByName('MapView');
    if (typeof mapView.selectedLayer != 'undefined') {
      mapView.findTaxID(mapID, parcelNo);
    }
    var router = app.getRouter('Main');
    var path = 'findTaxID/' + mapView.selectedLayerName + '/' + mapID + '/' + parcelNo;
    router.navigate(path, { trigger: false });
    mapView.actionHash = path;
    //update email link
    app.getView('Share').updateEmailLink(path);
    return false;
  }


});