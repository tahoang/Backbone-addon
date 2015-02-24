/*
Author: Tu Hoang
ESRGC 2014

index.js


Critical area web application
start up function
*/
var startup = app.startup = function() {
  console.log('Initilizing application...');

  //start application
  app.application({
    name: 'CriticalArea',
    views: [
      'Disclaimer',
      'Map',
      'Search',
      'Print',
      'Share'
    ],
    collections: [
     
    ],
    routers: [
      'Main'
    ],
    launch: function() {
      //for underscore template custom dilimiters
      _.templateSettings = {
        evaluate: /\{\[([\s\S]+?)\]\}/g,
        interpolate: /\{\{([\s\S]+?)\}\}/g
      };
      //force ajax calls not to cache requests
      $.ajaxSetup({ cache: false });
      console.log('Launch function run.');
    }
  });
};