/**
 * Angular Filters for Dandalin App
 */

'use strict';

angular.module('mean.rizers').filter('linkSafeString', function() {
	return function(str) {
		//console.log("linkSafeString?");
		if (str) {
			var str2=str.toLowerCase();
			str2=str2.split(" ").join("-");
			str2=str2.split("&").join("-");
			return str2;
		} else {
			//console.log("angular formatLink filter undefined");
			return "";
		}

	};
});

