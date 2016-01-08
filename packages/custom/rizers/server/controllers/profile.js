'use strict';

var mean = require('meanio');
var fs = require('fs');
var http = require('http');
var request = require('request')
var Tabletop = require('tabletop');
var config=mean.config.clean;

var rizerData={}

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

function buildRizers(apiStr,profileStr,profileObj) {
	/* if we're using a flat file, we'll have profileStr
	   if we're coming from tableTop, we'll have profileObj
	   did it that way because tableTop wasn't nicely stringify-ing
	*/

	/**** PROFILE JSON ****/
	var allProfileJson;
	if (profileObj) {
		allProfileJson=profileObj;
	} else {
		allProfileJson=JSON.parse(profileStr);
	}
	//console.log("ALL PROFILES JSON IS " + allProfileJson)
	var profilesById = {};
	for (var i=0; i < allProfileJson.length; i++) {
		var oneProfile = allProfileJson[i];
		profilesById[oneProfile.id] = oneProfile;
	}

	/**** API JSON ****/
	var allRizerJson = JSON.parse(apiStr).accounts;
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

	return {allRizerJson:allRizerJson, rizersById:rizersById} ;
}
	
module.exports = function(System){
  	
	function loadRizerDataLive() {
		request(config.accounts_api_URL, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				rizerData.apiStr=body;
				fs.writeFile(process.cwd() + config.apiFlatPath, rizerData.apiStr);
				console.log("requesting spreadsheet from " + config.spreadsheet_URL);
				var options = {
					key: config.spreadsheet_URL,
					postProcess: function(element) {
						element["timestamp"] = Date.parse( element["date"] );
					},
					callback: function(data) {
						rizerData.profileObj=data["profiles"].elements;
						fs.writeFile(process.cwd() + config.profileFlatPath, JSON.stringify(rizerData.profileObj));
						rizerData.rd=buildRizers(rizerData.apiStr,"",rizerData.profileObj);
 						
						console.log("LIVE DATA HAS FINISHED LOADING FOR THE APP!")
					}
				};
				Tabletop.init(options); 
				
			}
		});
	}  

	function loadRizerDataDisk() { 
		var profileStr=fs.readFileSync( process.cwd() + config.profileFlatPath);
		var apiStr=fs.readFileSync( process.cwd() + config.apiFlatPath );

		rizerData.rd=buildRizers(apiStr,profileStr);
		console.log("DISK DATA LOADED!")
	}

	//PICK YOUR POISON - LOAD FROM DISK OR FROM API/SPREADSHEET
	if (config.useLiveData) {
		loadRizerDataLive();	
	} else {
		loadRizerDataDisk();	
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
		//	if(process.env.NODE_ENV == "development") {
			if (rizerData && rizerData.rd && rizerData.rd.allRizerJson) {
				res.json(rizerData.rd.allRizerJson);
			} else {
				res.json({});
			}
			//renderLiveJson();
		},
		showOne:function(req,res) {
			console.log('returning one rizer');
			if (rizerData && rizerData.rd && rizerData.rd.rizersById) {
				var oneRizer=rizerData.rd.rizersById[req.params.id];
				res.json(oneRizer);
			} else {
				res.json({});
			}
		}
	};
};



