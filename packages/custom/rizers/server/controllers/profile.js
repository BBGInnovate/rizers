'use strict';

var mean = require('meanio');
var fs = require('fs');


module.exports = function(System){
  
	  /**** PROFILE JSON ****/
	var profileDataPath=process.cwd() + '/packages/custom/rizers/server/models/profiles.json';
	console.log('profileDataPath is ' + profileDataPath);
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
	  }
	}



  return {
    render:function(req,res){
      res.render('index',{ locals: { config: System.config.clean }});
    },
    aggregatedList:function(req,res) {
      res.send(res.locals.aggregatedassets);
    },
    showAll:function(req,res){
    	console.log('RETURNING RIZER JSON');
    	res.json(allRizerJson);
    },
    showOne:function(req,res) {
    	console.log('returning one rizer');
    	var oneRizer=rizersById[req.params.id];
    	res.json(oneRizer);
    }
  };
};



