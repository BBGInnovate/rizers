'use strict';

var mean = require('meanio');
var fs = require('fs');
var http = require('http');
var request = require('request')
var Tabletop = require('tabletop');
var config=mean.config.clean;

var categoryData={}

module.exports = function(System){
  	
	function loadCategoryDataLive() {
		request(config.accounts_api_URL, function (error, response, body) {
			console.log("requesting spreadsheet from " + config.spreadsheet_URL);
			var options = {
				key: config.spreadsheet_URL,
				postProcess: function(element) {
					element["timestamp"] = Date.parse( element["date"] );
				},
				callback: function(data) {
					console.log("Category SPREADSHEET DATA LOADED!")
					categoryData=data["categories"].elements;
					console.log("categoryData is " + categoryData);
					fs.writeFile(process.cwd() + config.categoryFlatPath, JSON.stringify(categoryData));
				}
			};
			Tabletop.init(options); 
		});
	}  

	function loadCategoryDataDisk() { 
		var categoryStr=fs.readFileSync( process.cwd() + config.categoryFlatPath);
		categoryData=JSON.parse(categoryStr);
		console.log("Category DISK DATA LOADED!")
	}

	//PICK YOUR POISON - LOAD FROM DISK OR FROM API/SPREADSHEET
	if (config.useLiveData) {
		loadCategoryDataLive();	
	} else {
		loadCategoryDataDisk();	
	}

	return {
		render:function(req,res){
			res.render('index',{ locals: { config: System.config.clean }});
		},
		aggregatedList:function(req,res) {
			res.send(res.locals.aggregatedassets);
		},
		showAll:function(req,res){
			console.log('RETURNING CATEGORY JSON');
			if (categoryData) {
				res.json(categoryData);
			} else {
				res.json({});
			}
		}
	};
};



