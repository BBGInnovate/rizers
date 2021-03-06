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
			var o = {
				profilesByCategory:rizeAPI.getAllProfilesByCategory(),
				categories:rizeAPI.getAllCategories()
			}
			res.json(o);
		},

		showOne:function(req,res) {
			var account= rizeAPI.getOneProfile(req.params.id);
			/* hack to fix api data returned */
			if (account.rize_links && account.rize_links[0] && account.rize_links[0].title=="") {
				account.rize_links[0].title=null;
			}
			if (account.rize_links && account.rize_links[0] && account.rize_links[0].url=="") {
				account.rize_links[0].url=null;
			}
			var category=rizeAPI.getOneCategory(account.profile.category)
			var categoryListing= new Array();

			/* this category listing object is maintained separately from the accounts so that angular doesn't include it in the search filter 
			   ideally, this object would be created and initialized when the app is initialized, but this
			   works.
			*/
			var prevAccount={};
			var nextAccount={};
			for (var i=0; i < category.accounts.length;i++) {
				var curr = category.accounts[i];
				var currAccount={selected:"",index:i,display_name:curr.display_name, id:curr.id}

				if (category.accounts[i].id==account.id) {
					currAccount.selected="selected";
					var nextAccountIndex=i+1;
					var prevAccountIndex=i-1;
					if (i==0) {
						prevAccountIndex=category.accounts.length-1;
					} else if (i==(category.accounts.length-1)) {
						nextAccountIndex=0;
					}
					var prev = category.accounts[prevAccountIndex];
					var next = category.accounts[nextAccountIndex];
					
					prevAccount={display_name:prev.display_name,id:prev.id, profileImage:prev.profile.profileImage, image:prev.profile.image}
					nextAccount={display_name:next.display_name,id:next.id, profileImage:next.profile.profileImage, image:next.profile.image}
					
				}
				categoryListing.push(currAccount);
			}

			res.json({account:account, categoryListing:categoryListing, prevAccount:prevAccount, nextAccount:nextAccount});
		}
	};
};



