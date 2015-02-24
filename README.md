# Backbone-addon

Backbone has a great MV* convention, however, the views, models, and collections need to be managed in some way for easy access in application. This add-on provides ways to access those components in one place via app global variable.

###Getting Started
 Download the source code to your client side JavaScript folder.


###Application setup
1. Navigate to your application folder.
2. Create application folder in your client code folder. This folder looks like the sampleApp folder, which contains collections, models, routers, and views
3. Create index.js to tell the add-on what to load into the app on start up

```javascript
var startup = app.startup = function() {
  console.log('Initilizing application...');

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
     
      console.log('Launch function run.');
    }
  });
};
```

###Usage
1. Make sure your html page reference your javascript code. 
2. Trigger application startup function in your HTML page.
```javascript
    $(function() {
      if (typeof startup == 'function')
        startup();
    });

```