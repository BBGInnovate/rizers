'use strict';

var mean = require('meanio');
var fs = require('fs');
var http = require('http');
var request = require('request')
var Tabletop = require('tabletop');
var config=mean.config.clean;

var categoryData={}
var categoriesById = {}


module.exports = function(System){
	var profile = require('../controllers/profile')(System);
  	
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

					for (var i=0; i<categoryData.length; i++) {
						var c=categoryData[i];
						categoriesById[c.id]=c;
					}

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
		for (var i=0; i<categoryData.length; i++) {
			var c=categoryData[i];
			categoriesById[c.id]=c;
		}
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
		}, 
		showOne:function(req,res){
			console.log('RETURNING CATEGORY JSON FOR ID ' + req.params.id);
			if (categoryData) {
				var c = categoriesById[req.params.id];
				
				/* a nice optimization would be if the profile controller let us fetch directly by id so we don't need a loop here */
				var accounts=profile.getAll();
				var filteredAccounts=[];
				for (var i=0; i< accounts.length; i++) {
					if (accounts[i].profile.category==c.name) {
						filteredAccounts.push(accounts[i]);
					}
				}
				var o = {category:categoriesById[req.params.id], accounts:filteredAccounts}
				res.json(o);
				
			} else {
				res.json({});
			}
		}
	};
};



