'use strict';

var mean = require('meanio');
var rizeAPI = require('../../../../custom/rizers/server/service/rizeAPI');


module.exports = function(System){
  return {
    render:function(req,res){
      //OPTIMIZE: this logic is currently duplicated on the frontend in the linkSafeString filter
      var categories = rizeAPI.getAllCategories();
      for (var i=0; i < categories.length; i++) {
      	categories[i].safeName=categories[i].name.replace(" ", "-").toLowerCase().replace("&","-");
      }
      res.render('index',{ locals: { categories:categories, config: System.config.clean,  }});
    },
    aggregatedList:function(req,res) {
      res.send(res.locals.aggregatedassets);
    }
  };
};
