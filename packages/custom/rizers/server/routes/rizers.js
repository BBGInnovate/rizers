'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Rizers, app, auth, database) {

	var profile = require('../controllers/profile')(Rizers);
	var category = require('../controllers/category')(Rizers);

	app.route('/api/accounts/').get(profile.showAll);
	app.route('/api/accounts/:id').get(profile.showOne);
	app.route('/api/categories/').get(category.showAll);

	
};
