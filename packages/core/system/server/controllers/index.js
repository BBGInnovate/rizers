'use strict';

var mean = require('meanio');
var rizeAPI = require('../../../../custom/rizers/server/service/rizeAPI');
var phantom = require('phantom');
var config = mean.config.clean;

var rizeConfig={
  applicationUrl:config.applicationUrl,
  fbAppID:config.fbAppID
}

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
            var translatedURL=config.applicationUrl + req.query._escaped_fragment_;
            var simpleRender=false;
            if (translatedURL.indexOf("/accounts/") != -1 ) {
               var urlArray=translatedURL.split("/");
               if (urlArray.length > 5) {
                  var accountID=urlArray[5];
                  if (accountID != null && accountID != "") {
                    console.log("render simpleSEO for accountID " + accountID);
                    var account = rizeAPI.getOneProfile(accountID);
                    account.profileUrl=translatedURL;
                    simpleRender=true;
                    res.render('rizeSEO',{
                        account:account
                    });     
                  }
               }
            } 
            if (!simpleRender) {
                console.log('running phantomJS for ' + translatedURL);
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
            }
          // If there is no _escaped_fragment_, we return the normal index template.
          } else {
            res.render('index',{
                categories:categories, 
                rizeConfig:JSON.stringify(rizeConfig), 
                locals: {config: System.config.clean}
            });  
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
