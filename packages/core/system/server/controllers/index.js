'use strict';

var mean = require('meanio');
var rizeAPI = require('../../../../custom/rizers/server/service/rizeAPI');
var phantom = require('phantom');
var config = mean.config.clean;

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
        //console.log("lets check the request");
        if(typeof(req.query._escaped_fragment_) !== 'undefined') {
            //console.log("PHANTOM JS - indexJS called!");
            var translatedURL=config.applicationUrl + req.query._escaped_fragment_;
            phantom.create(function(ph) {
              ph.createPage(function(page) {
                //console.log('opening page ' + translatedURL);
                page.open(translatedURL, function(status) {
                  page.evaluate((function() {   // jshint ignore:line
                    return document.getElementsByTagName('html')[0].innerHTML;
                  }), function(result) {
                    res.send(result);
                    return ph.exit();
                    //ph._phantom.kill('SIGTERM');
                  });
                });
              });
            });
          // If there is no _escaped_fragment_, we return the normal index template.
          } else {
            res.render('index',{ locals: {categories:categories, config: System.config.clean,  }});  
          }
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
