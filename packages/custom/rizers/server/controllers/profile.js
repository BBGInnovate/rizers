'use strict';

var mean = require('meanio');
var fs = require('fs');
var http = require('http');
var request = require('request')
var Tabletop = require('tabletop');
var config=mean.config.clean;

var rizeAPI = require('../service/rizeAPI');

module.exports = function(System){
	return {
		showAll:function(req,res){
			res.json(rizeAPI.getAllProfiles());
		},
		showOne:function(req,res) {
			res.json(rizeAPI.getOneProfile(req.params.id));
		}
	};
};



