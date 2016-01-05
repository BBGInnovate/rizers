'use strict';

var mean = require('meanio');
var fs = require('fs');


/* Splits data into separate paragraphs*/
function splitParagraphs(source){
	var splitGraphs = '';

	var paragraphs = (source===null) ? '' : source;
	paragraphs = paragraphs.split('\n')

	for (var i = 0; i<paragraphs.length; i++){
		splitGraphs += '<p>' + paragraphs[i] + '</p>';
	}
	return splitGraphs
}

module.exports = function(System){
  
	  /**** PROFILE JSON ****/
	var profileDataPath = process.cwd() + '/packages/custom/rizers/server/models/profiles.json';
	console.log('profileDataPath is ' + profileDataPath);
	var allProfileJson = JSON.parse(fs.readFileSync( profileDataPath ));
	var profilesById = {};
	for (var i=0; i < allProfileJson.length; i++) {
		var oneProfile = allProfileJson[i];
		profilesById[oneProfile.id] = oneProfile;
	}




	/**** API JSON ****/
	var apiDataPath = process.cwd() + '/packages/custom/rizers/server/models/api.json';
	var allRizerJson = JSON.parse(fs.readFileSync( apiDataPath )).accounts;
	var rizersById = {};
	for (i = 0; i < allRizerJson.length; i++) {
		var oneRizer = allRizerJson[i];
		rizersById[oneRizer.id] = oneRizer;
		oneRizer.profile = profilesById[oneRizer.id];
		oneRizer.location = oneRizer.city_name + ', ' + oneRizer.country_name;


		oneRizer.rize_summary = splitParagraphs(oneRizer.rize_summary);


		//Trying to split the categories into an array and return the first value
		oneRizer.categories = (oneRizer.categories === null) ? '' : oneRizer.categories;
		oneRizer.categories = oneRizer.categories.split(', ');
		oneRizer.categories = oneRizer.categories[0];


		oneRizer.person = false;
		if (oneRizer.account_type === 'Person') {
			oneRizer.person = true;
		} else {
			//Add the preferred profile image
			//Order should be Spreadsheet -> Twitter -> Facebook
			oneRizer.profile_image = '';
			
			if (oneRizer.twitter.profile_image_url_https !== null){
				oneRizer.profile_image = oneRizer.twitter.profile_image_url_https;
			} else if (oneRizer.facebook.profile_image !== null){
				oneRizer.profile_image = oneRizer.facebook.profile_image;
			} else {
				//add a column to the spreadsheet for a fallback image/logo
			}
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



