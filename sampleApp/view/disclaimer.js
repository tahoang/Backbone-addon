/*
Author: Tu Hoang
ESRGC 2014 

CBCA

Disclaimer view using backbone.js
element: '#modal-disclaimer'
renders disclaimer for cbca

*/

app.View.Disclaimer = Backbone.View.extend({
  name: 'Disclaimer',
  el: '#modal-disclaimer',
  events: {
    'click input#agreementCheck': 'onAgreementCheck'
  },
  initialize: function() {
    this.$el.modal({
      keyboard: false
    });
  },
  render: function() {

  },
  onAgreementCheck: function(e) {
    var target = e.target;
    var checked = $(target).prop('checked');
    if (checked)
      this.$('#btn-proceed').removeClass('disabled');
    else
      this.$('#btn-proceed').addClass('disabled');
  }


});