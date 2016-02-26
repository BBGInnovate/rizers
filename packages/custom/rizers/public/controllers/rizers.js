'use strict';

/* jshint -W098 */
angular.module('mean.rizers').controller('RizersController', ['$scope', 'Global', 'Rizers','$http','$stateParams','$location','$sce','$timeout',
  function($scope, Global, Rizers,$http,$stateParams,$location,$sce,$timeout) {
      $scope.global = Global;
      $scope.package = {
        name: 'rizers'
      };

      function sendGA(eventDetailStr) {
        //console.log(eventDetailStr + " " + $location.path());

        ga('set', 'page', $location.path());
        ga('send', 'pageview');
      }

      $scope.findAccounts = function() {
        $http.get('/api/accounts/').success(function(data) {
          var runSearch=function() {
            document.getElementById('searchPreloader').style.display="none";
      		  $scope.accountsByCategory=data.profilesByCategory;
            $scope.categories=data.categories;
            sendGA('accountList');
          }
          var timeoutMS=0;
          if (window.rizeConfig.forceDelay) {
            timeoutMS=1000;
          }
          $timeout(runSearch, timeoutMS);
    	  });
      };

      $scope.findOneAccount = function() {
        /* this is called by the profile detail view */
        $http.get('/api/accounts/'+ $stateParams.accountId).success(function(data) {

              var runProfile = function() {
                document.getElementById('profilePreloader').style.display="none";
                $scope.showMap=false;
                $scope.account=data.account;
                if ($scope.account.city.latitude) {
                  $scope.showMap=true;
                }
                $scope.shareURL = $location.$$absUrl;
                $scope.shareURLEncoded = $location.$$absUrl;
                $scope.twitterShareText="Check out " + $scope.account.display_name + " on 2016 Rizers";
                $scope.safeYoutubeUrl="";
                if ($scope.account.profile.youtube != "") {
                  $scope.safeYoutubeUrl=$sce.trustAsResourceUrl($scope.account.profile.youtube)
                }
                if ($scope.account.profile.quotationLink == "") {
                  $scope.account.profile.quotationLink="#";
                }
                $scope.categoryListing=data.categoryListing;
                $scope.nextAccount=data.nextAccount;
                $scope.prevAccount=data.prevAccount;
                $sce.trustAsHtml($scope.account.profile.quotation); 

                // set metadata for meta tags
                var metaTags = document.getElementsByTagName('meta');
                for (var i = 0; i < metaTags.length; i++) {
                  if(metaTags[i].getAttribute('property') === 'og:title') {
                    metaTags[i].setAttribute('content', $scope.account.display_name);
                  }

                  if(metaTags[i].getAttribute('property') === 'og:description' || metaTags[i].getAttribute('name') === 'description') {
                    metaTags[i].setAttribute('content', $scope.account.rize_summary_stripped);
                  }

                  if(metaTags[i].getAttribute('property') === 'og:image') {
                    metaTags[i].setAttribute('content', $scope.account.social_media_image);
                  }

                  if(metaTags[i].getAttribute('property') === 'og:url') {
                    metaTags[i].setAttribute('content', $location.$$absUrl);
                  }

                  if(metaTags[i].getAttribute('property') === 'twitter:title') {
                    metaTags[i].setAttribute('content', $scope.account.display_name);
                  }

                  if(metaTags[i].getAttribute('property') === 'twitter:description') {
                    metaTags[i].setAttribute('content', $scope.account.rize_summary_stripped);
                  }

                  if(metaTags[i].getAttribute('property') === 'twitter:image') {
                    metaTags[i].setAttribute('content', $scope.account.social_media_image);
                  }
                }



                sendGA('profileDetail');
              }
              var timeoutMS=0;
              if (window.rizeConfig.forceDelay) {
                timeoutMS=1000;
              }
              $timeout(runProfile, timeoutMS);

      	  });	
      };

      $scope.findCategory = function() {
        
        /* this is called by the category detail page */
        var runCategory = function() {
          $http.get('/api/categories/'+$stateParams.categoryId).success(function(data) {
            document.getElementById('categoryPreloader').style.display="none";
                
            $scope.accountList=data.accounts;
            $scope.category=data.category;
            $scope.categoryId=$stateParams.categoryId;
            sendGA('category detail');
          });
        }
        var timeoutMS=0;
        if (window.rizeConfig.forceDelay) {
          timeoutMS=1000;
        }
        $timeout(runCategory, timeoutMS);
      };

      $scope.findCategories = function() {
        /* this is called by the category list view */
        var runCategories = function() {
          $http.get('/api/categories/').success(function(data) {
            document.getElementById('homePreloader').style.display="none";
            $scope.categoryList=data;
            sendGA('category list page');
          });
        }
        var timeoutMS=0;
        if (window.rizeConfig.forceDelay) {
          timeoutMS=1000;
        }
        $timeout(runCategories, timeoutMS);
      };

  }
]);

/**** the following code make the dropdown menu hide when you click anywhere else in the doc ****/
angular.module('mean.rizers').run(function($rootScope,$anchorScroll) {
  angular.element(document).on("click", function(e) {
      $rootScope.$broadcast("documentClicked", angular.element(e.target));
  });
  $rootScope.$on("documentClicked", function(inner, target) {
    if (!$(target[0]).is(".menu-button") && !$(target[0]).parents(".menu-button").length > 0) {
      document.getElementById("dropdown-nav").classList.remove("show");
    }
  });
  // When the route changes, scroll user to the top of the page
  $rootScope.$on('$locationChangeSuccess', function() {
    $anchorScroll();
  });

});