'use strict';

var mean = require('meanio');
var rizeAPI = require('../../../../custom/rizers/server/service/rizeAPI');


module.exports = function(System){
  return {
    render:function(req,res){
      //OPTIMIZE: this logic is currently duplicated on the frontend in the linkSafeString filter
      var categories = rizeAPI.getAllCategories();
      for (var i=0; i < categories.length; i++) {
      	
        var str2=categories[i].name.toLowerCase();
        str2=str2.split(" ").join("-");
        str2=str2.split("&").join("-");

        categories[i].safeName=str2;
      }
      if (categories.length > 0) {
        res.render('index',{ locals: {categories:categories, config: System.config.clean,  }});  
      } else {
        //swig templates are cached.  
        //we don't want to render that index view until our categories are ready or our navigation breaks
        res.json({status:'site is reloading'});  
      }
      
    },
    aggregatedList:function(req,res) {
      res.send(res.locals.aggregatedassets);
    }
  };
};
