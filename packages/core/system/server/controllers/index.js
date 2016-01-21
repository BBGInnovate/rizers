'use strict';

var mean = require('meanio');
var rizeAPI = require('../../../../custom/rizers/server/service/rizeAPI');
var utils = require('../../../../custom/rizers/server/lib/utils');
var phantom = require('phantom');
var config = mean.config.clean;

/*
var rizeConfig={
  applicationUrl:config.applicationUrl,
  fbAppID:config.fbAppID,
  applicationName:config.applicationName
}*/
var rizeConfig=config;
var frontEndConfig={
  applicationUrl:config.applicationUrl,
  fbAppID:config.fbAppID,
  applicationName:config.applicationName
}

module.exports = function(System){
  return {
    render:function(req,res){
      //OPTIMIZE: this logic is currently duplicated on the frontend in the linkSafeString filter
      var categories = rizeAPI.getAllCategories();
      
      for (var i=0; i < categories.length; i++) {
        categories[i].safeName=utils.linkSafeString(categories[i].name);
      }

      if (categories.length > 0) {

        /** facebook/twitter don't obey the meta tag about fragments, so we detect user agent and behave appropriately **/
        /* for FB this is important for regular shares - for Twitter it's so that card detail views show images */
        var userAgent = req.headers['user-agent'];
        if (userAgent.indexOf('facebookexternalhit') >= 0 || userAgent.indexOf('Twitterbot') >= 0) {
          req.query._escaped_fragment_=req.originalUrl;
        }

        if(typeof(req.query._escaped_fragment_) !== 'undefined') {
            var translatedURL=config.applicationUrl;
            if (req.query._escaped_fragment_.charAt(0)=="/") {
              translatedURL+=req.query._escaped_fragment_.substr(1);
            } else {
              translatedURL+=req.query._escaped_fragment_;
            }
            var simpleRender=false;
            if (translatedURL.indexOf("/accounts/") != -1 ) {
               var urlArray=translatedURL.split("/");
               if (urlArray.length > 4) {
                  var accountID=urlArray[4];
                  if (accountID != null && accountID != "") {
                    console.log("render simpleSEO for accountID " + accountID);
                    var account = rizeAPI.getOneProfile(accountID);
                    account.profileUrl=translatedURL;
                    simpleRender=true;
                    res.render('rizeSEO',{
                        account:account,
                        rizeConfig:rizeConfig,
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
            var animate=false;
            if (req.param('animate')) {
              animate=true;
            }
            res.render('index',{
                categories:categories, 
                rizeConfigStr:JSON.stringify(frontEndConfig),
                rizeConfig:rizeConfig,
                locals: {config: System.config.clean},
                animate:animate
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
