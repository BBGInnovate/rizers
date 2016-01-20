/**
 * @fileOverview 	
 * @author 			Joseph Flowers <jflowers@bbg.gov>
 * @version 		0.0.1
 * @module 			rizeAPI
 */
'use strict';
/* *************************** Required Classes **************************** */

var mean = require('meanio');
var fs = require('fs');
var http = require('http');
var request = require('request')
var Tabletop = require('tabletop');
var config=mean.config.clean;

/* *************************** Constructor Code **************************** */
var rizerData={}
var categoryData={}
var categoriesById = {}

/* *************************** Public Methods ****************************** */

function init() {
	//PICK YOUR POISON - LOAD FROM DISK OR FROM API/SPREADSHEET
	if (config.useLiveData) {
		loadDataLive(false);	
	} else {
		loadDataDisk();	
	}
}
exports.init=init;

function updateDisk(req,res) {
	console.log("updating the disk files");
	loadDataLive(true, res);
};
exports.updateDisk=updateDisk;

function getAllProfiles () {
	if (rizerData && rizerData.rd && rizerData.rd.allRizerJson) {
		return rizerData.rd.allRizerJson;
	} else {
		return {};
	}
}
exports.getAllProfiles=getAllProfiles;

function getOneProfile(profileId) {
	if (rizerData && rizerData.rd && rizerData.rd.rizersById) {
		var oneRizer=rizerData.rd.rizersById[profileId];
		var profileCategoryID=oneRizer.profile.category;
		oneRizer.profile.categoryData=categoriesById[profileCategoryID];
		return oneRizer;
	} else {
		return {};
	}
}
exports.getOneProfile=getOneProfile;

function getAllCategories () {
	if (categoryData) {
		return categoryData;
	} else {
		return {};
	}
}
exports.getAllCategories=getAllCategories;

function getOneCategory(categoryId) {
	var c = categoriesById[categoryId];
	var accounts=getAllProfiles();
	var filteredAccounts=[];
	for (var i=0; i< accounts.length; i++) {
		if (accounts[i].profile && accounts[i].profile.category==c.id) {
			filteredAccounts.push(accounts[i]);
		}
	}
	var o = {category:categoriesById[categoryId], accounts:filteredAccounts};
	return o;
}
exports.getOneCategory=getOneCategory;

/* *************************** Private Methods ***************************** */
function loadDataLive(renderMessage,res) {
	console.log("requesting api from " + config.accounts_api_URL);
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
					
					/**** STORE PROFILE DATA IN MEMORY AND WRITE TO DISK****/
					rizerData.profileObj=data["profiles"].elements;
					rizerData.rd=buildRizers(rizerData.apiStr,"",rizerData.profileObj);
					fs.writeFile(process.cwd() + config.profileFlatPath, JSON.stringify(rizerData.profileObj));

					/**** STORE CATEGORY DATA IN MEMORY ****/
					categoryData=data["categories"].elements;
					for (var i=0; i<categoryData.length; i++) {
						var c=categoryData[i];
						categoriesById[c.id]=c;
					}
					fs.writeFile(process.cwd() + config.categoryFlatPath, JSON.stringify(categoryData));
					console.log("LIVE DATA HAS FINISHED LOADING FOR THE APP!")
					if (res) {
						res.json({status:"Data updated successfully."});
					}
				}
			};
			Tabletop.init(options); 
		}
	});
}  

function loadDataDisk() { 
	/*** LOAD PROFILE/API DATA FROM DISK INTO MEMORY ****/
	var profileStr=fs.readFileSync( process.cwd() + config.profileFlatPath);
	var apiStr=fs.readFileSync( process.cwd() + config.apiFlatPath );
	rizerData.rd=buildRizers(apiStr,profileStr);

	/*** LOAD CATEGORY DATA FROM DISK INTO MEMORY ****/
	var categoryStr=fs.readFileSync( process.cwd() + config.categoryFlatPath);
	categoryData=JSON.parse(categoryStr);
	for (var i=0; i<categoryData.length; i++) {
		var c=categoryData[i];
		categoriesById[c.id]=c;
	}
	console.log("DISK DATA LOADED!")
}

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
		
		if (profilesById[oneRizer.id]) {


			oneRizer.profile = profilesById[oneRizer.id];


			//Create a location with 'City, Country'
			oneRizer.location = oneRizer.city.city_name + ', ' + oneRizer.country_name;


			if (oneRizer.profile.summary != ""){
				oneRizer.rize_summary = splitParagraphs(oneRizer.profile.summary);
			} else {
				oneRizer.rize_summary = splitParagraphs(oneRizer.rize_summary);
			}
             oneRizer.rize_summary_stripped=oneRizer.rize_summary.replace(/(<([^>]+)>)/ig, "");
 


			//Order should be Spreadsheet -> Twitter -> Facebook
			oneRizer.profile_image = '';
			oneRizer.profile_image_small = '';
			
			if (oneRizer.profile.profileImage != ""){
				oneRizer.profile_image = oneRizer.profile.profileImage;
				oneRizer.profile_image_small = oneRizer.profile.profileImage;
			} else if (oneRizer.twitter.profile_image_url_https !== null){
				//oneRizer.profile_image = "https://twitter.com/" + [screen_name] + "/profile_image?size=normal";
				oneRizer.profile_image = oneRizer.twitter.profile_image_url_https;
				oneRizer.profile_image_small = oneRizer.twitter.profile_image_url_https.replace("400x400","bigger");
			} else if (oneRizer.facebook.profile_image !== null){
				oneRizer.profile_image = oneRizer.facebook.profile_image;
				oneRizer.profile_image_small = oneRizer.facebook.profile_image;
			} else {
				//
			}
			oneRizer.social_media_image=oneRizer.profile.profileImage;
			if (oneRizer.social_media_image == "") {
				oneRizer.social_media_image="https://africa.rizing.org/wp-content/uploads/2015/12/cropped-Rize-socialprofiles.png";
			}


			//Replace linkedin job title with the spreadsheet title (or add a tagline for organizations)
			oneRizer.tagline = "";
			if (oneRizer.profile.job != "") {
				oneRizer.tagline = oneRizer.profile.job;
			} else {
				oneRizer.tagline = oneRizer.linkedin.job_title;
			}
		} else {
			console.log("id " + oneRizer.id + " has no profile");
		}

	}

	return {allRizerJson:allRizerJson, rizersById:rizersById} ;
}