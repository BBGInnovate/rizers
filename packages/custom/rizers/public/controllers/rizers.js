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
    		  $scope.accountsByCategory=data.profilesByCategory;
          $scope.categories=data.categories;
          sendGA('accountList');
    	  });
      };

      $scope.findOneAccount = function() {
        /* this is called by the profile detail view */
        $http.get('/api/accounts/'+ $stateParams.accountId).success(function(data) {

              var runProfile = function() {
                document.getElementById('profilePreloader').style.display="none";
                $scope.showMap=false;
                if (data.city.latitude) {
                  $scope.showMap=true;
                }
                $scope.account=data;
                $scope.shareURL = $location.$$absUrl;
                $scope.shareURLEncoded = $location.$$absUrl;
                $scope.twitterShareText="Check out " + data.display_name + " on 2016 Rizers";
                $scope.safeYoutubeUrl="";
                if (data.profile.youtube != "") {
                  $scope.safeYoutubeUrl=$sce.trustAsResourceUrl(data.profile.youtube)
                }
                if (data.profile.quotationLink == "") {
                  data.profile.quotationLink="#";
                }
                $sce.trustAsHtml($scope.account.profile.quotation); 
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