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
			var account= rizeAPI.getOneProfile(req.params.id);
			var category=rizeAPI.getOneCategory(account.profile.category)

			for (var i=0; i < category.accounts.length;i++) {
				if (category.accounts[i].id==account.id) {
					var nextAccountIndex=i+1;
					var prevAccountIndex=i-1;
					if (i==0) {
						prevAccountIndex=category.accounts.length-1;
					} else if (i==(category.accounts.length-1)) {
						nextAccountIndex=0;
					}
					var prev = category.accounts[prevAccountIndex];
					var next = category.accounts[nextAccountIndex];
					account.prevAccount={display_name:prev.display_name,id:prev.id, profileImage:prev.profile.profileImage, image:prev.profile.image}
					account.nextAccount={display_name:next.display_name,id:next.id, profileImage:next.profile.profileImage, image:next.profile.image}
				}
			}
			res.json(account);
		}
	};
};



