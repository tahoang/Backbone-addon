/*
Author: Tu Hoang
ESRGC 2014 

CBCA

Search view using backbone.js
element: '.sidebar-pane#Share'
renders Search for cbca

*/

app.View.Share = Backbone.View.extend({
  name: 'Share',
  el: '.sidebar-pane#share',
  events: {
    'submit #form-email': 'onShareBtnClick',
    'change #recipient': 'onToAddressChange'
  },
  initialize: function() {
    this.$('#form-email').validate();
  },
  render: function() {

  }, //to activate Share
  onShareBtnClick: function(e) {
    var data = app.getFormData($(e.target));
    var model = new Backbone.Model(data);
    model.url = 'sendEmail';
    var scope = this;
    $('#btn-send-email').button('loading');
    model.save({}, {
      success: function(model, res) {
        if (res.status = 'Sent') {
          var btn = scope.$('#btn-send-email');
          btn.attr('value', 'Email Sent');
          btn.attr('disabled', true);
          $('#sent-instruction').text("Edit recipient's email address to send a new email.");
        }
      }
    })

    return false;
  },
  onToAddressChange: function(e) {
    var btn = $('#btn-send-email');
    btn.attr('value', 'Send');
    btn.removeAttr('disabled');
    btn.removeClass('disabled');
    $('#sent-instruction').text('');
  },
  updateEmailLink: function(hash) {
    var scope = this;

    //for cross browser since ie's location object does not have origin attribute
    var protocol = $(location).attr('protocol');
    var hostname = $(location).attr('hostname');
    var pathname = $(location).attr('pathname');
    var url = protocol + '//' + hostname + pathname;

    //construct query string
    url += '#' + hash

    var messageText = 'Please use the link below to view the property.\n';
    //append url to message
    this.$('#message').val('\n\n' + messageText + encodeURI(url));

  }

});

