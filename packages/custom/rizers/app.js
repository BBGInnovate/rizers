'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Rizers = new Module('rizers');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Rizers.register(function(app, auth, database, system) {
app.set('views', __dirname + '/server/views');
  //We enable routing. By default the Package Object is passed to the routes
  Rizers.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Rizers.menus.add({
    title: 'rizers example page',
    link: 'rizers example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  Rizers.aggregateAsset('css', 'rizers.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Rizers.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Rizers.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Rizers.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Rizers;
});
