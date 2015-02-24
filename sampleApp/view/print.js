/*
Author: Tu Hoang
ESRGC 2014 

CBCA

Search view using backbone.js
element: '.sidebar-pane#print'
renders Search for cbca

*/

app.View.Print = Backbone.View.extend({
  name: 'Print',
  el: '.sidebar-pane#print',
  events: {
    'click #btn-activate-print': 'onPrintBtnClick'
  },
  render: function() {

  }, //to activate print
  onPrintBtnClick: function(e) {
    var mapView = app.getView('MapView');
    var actionHash = mapView.actionHash;
    if (actionHash != '') {
      console.log(actionHash);
      this.$('#print-message').text('');
      var url = 'print#' + actionHash;
      window.open(url, '_blank');
    }
    else
      this.$('#print-message').text('Please select a parcel/property first!');
    return false;
  }

});
