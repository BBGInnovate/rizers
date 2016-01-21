'use strict';

var mean = require('meanio');
var config=mean.config.clean;

var rizeAPI = require('../service/rizeAPI');
var utils = require('../lib/utils');


module.exports = function(System){
	return {
		show:function(req,res){
			
			var URL_PREFIX=config.applicationUrl;

			var accounts= rizeAPI.getAllProfiles();
			var categories = rizeAPI.getAllCategories();

			var xmlStr='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
			var allUrls=[{fullUrl:URL_PREFIX,changefreq:"monthly"}];

			for (var i=0; i < accounts.length; i++) {
				var a = accounts[i];
				var o = {};
				o.fullUrl=URL_PREFIX+"accounts/"+a.id+"/"+utils.linkSafeString(a.display_name);
				o.changefreq="monthly";
				allUrls.push(o);
			}
			for (var i=0; i < categories.length; i++) {
				var a = categories[i];
				var o = {};
				o.fullUrl=URL_PREFIX+"categories/"+a.id+"/"+utils.linkSafeString(a.name);
				o.changefreq="monthly";
				allUrls.push(o);
			}
			for (var i=0; i < allUrls.length; i++) {
				var a = allUrls[i];
				xmlStr += '<url>';
				xmlStr+='<loc>'+allUrls[i].fullUrl+'</loc>';
				if (allUrls[i].hasOwnProperty('changefreq')) {
					xmlStr+='<changefreq>'+allUrls[i].changefreq+'</changefreq>';
				}
				xmlStr+='</url>';
			}
			xmlStr+='</urlset>';

			res.set('Content-Type', 'text/xml');
			res.send(xmlStr);
		}
	};
};



