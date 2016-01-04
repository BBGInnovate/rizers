'use strict';

var fs = require('fs');



/**** PROFILE JSON ****/
var profileDataPath=process.cwd() + '/packages/custom/rizers/server/models/profiles.json';
var allProfileJson=JSON.parse(fs.readFileSync( profileDataPath ));
var profilesById = {};
for (var i=0; i < allProfileJson.length; i++) {
  var oneProfile=allProfileJson[i];
  profilesById[oneProfile.id]=oneProfile;
}

/**** API JSON ****/
var apiDataPath = process.cwd() + '/packages/custom/rizers/server/models/api.json';
var allRizerJson = JSON.parse(fs.readFileSync( apiDataPath )).accounts;
var rizersById = {};
for (var i=0; i < allRizerJson.length; i++) {
  var oneRizer = allRizerJson[i];
  rizersById[oneRizer.id] = oneRizer;
  oneRizer.profile = profilesById[oneRizer.id];
  oneRizer.location = oneRizer.city_name + ", " + oneRizer.country_name;

  //Check if linkedin info is available.
  if (oneRizer.linkedin) {
    oneRizer.job_title = oneRizer.linkedin.job_title;

    oneRizer.linkedin_link = '<li class="rize-profile-social-link"><a href="' +oneRizer.linkedin.url + '"></a></li>';
  }
}



/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Rizers, app, auth, database) {
  app.get('/api/accounts/', function(req, res, next) {
    res.json(allRizerJson);
  });
  app.route('/api/accounts/:id')
    .get(function(req,res,next){ 
      var oneRizer=rizersById[req.params.id];
      res.json(oneRizer);
    });

  app.get('/api/profiles/', function(req, res, next) {
    res.json(allProfileJson);
  });
  app.route('/api/profiles/:id')
    .get(function(req,res,next){ 
      var oneProfile=profilesById[req.params.id];
      res.json(oneProfile);
    });


  app.get('/api/rizers/example/render', function(req, res, next) {
    Rizers.render('index', {
      package: 'rizers'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
};
