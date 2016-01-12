/**
 * Angular Filters for Dandalin App
 */

'use strict';

angular.module('mean.rizers').filter('linkSafeString', function() {
	return function(str) {
		//console.log("linkSafeString?");
		if (str) {
			var str2=str.replace(" ", "-");
			return str2;
		} else {
			//console.log("angular formatLink filter undefined");
			return "";
		}

	};
});

