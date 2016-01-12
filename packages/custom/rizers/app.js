'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;
var rizeAPI = require('./server/service/rizeAPI');

var Rizers = new Module('rizers');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Rizers.register(function(app, auth, database, system) {
app.set('views', __dirname + '/server/views');
  //We enable routing. By default the Package Object is passed to the routes
  Rizers.routes(app, auth, database);
  
  //put all css files into one
  Rizers.aggregateAsset('css', 'rizers.css');

  //initialize the API
  rizeAPI.init();

  return Rizers;
});

