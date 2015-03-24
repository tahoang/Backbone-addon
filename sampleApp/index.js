/*
Author: Tu Hoang
ESRGC 2014

index.js


backbone application
start up function
*/
var startup = app.startup = function() {
  console.log('Initilizing application...');

  //start application
  app.application({
    name: 'Sample app',
    views: [
      
    ],
    collections: [
     
    ],
    routers: [
      'Main'
    ],
    launch: function() {
      //custom code on app launch event

      //for underscore template custom dilimiters
      _.templateSettings = {
        evaluate: /\{\[([\s\S]+?)\]\}/g,
        interpolate: /\{\{([\s\S]+?)\}\}/g
      };
      ////force ajax calls not to cache requests
      //$.ajaxSetup({ cache: false });
      console.log('Launch function run.');
    }
  });
};