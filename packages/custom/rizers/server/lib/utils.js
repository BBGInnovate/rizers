/**
 * @fileOverview 	I contain utility functions.
 * @module 			Utils
 */
'use strict';
/* *************************** Required Classes **************************** */
/* *************************** Constructor Code **************************** */
/* *************************** Public Methods ****************************** */

/**
 * I dedup an array of objects by key.
 * @param theArray - I am the array to dedupe.
 * @param key - I am the key to dedupe the array by.
 * @returns {Array}
 */
function linkSafeString( str ){

	var str2=str.toLowerCase();
        str2=str2.split(" ").join("-");
        str2=str2.split("&").join("-");

	return str2;
}
exports.linkSafeString = linkSafeString;
