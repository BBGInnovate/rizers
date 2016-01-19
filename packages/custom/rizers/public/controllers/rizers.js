'use strict';

/* jshint -W098 */
angular.module('mean.rizers').controller('RizersController', ['$scope', 'Global', 'Rizers','$http','$stateParams','$location', 
  function($scope, Global, Rizers,$http,$stateParams,$location) {
      $scope.global = Global;
      $scope.package = {
        name: 'rizers'
      };

      function sendGA() {
        ga('set', 'page', $location.path());
        ga('send', 'pageview');
      }

      $scope.findAccounts = function() {
        $http.get('/api/accounts/').success(function(data) {
    		  $scope.accounts=data;

          console.log('notify google - account list page ' + $location.path());
          //sendGA();
          

    	  });
      };

      $scope.findOneAccount = function() {
        /* this is called by the profile detail view */
        $http.get('/api/accounts/'+ $stateParams.accountId).success(function(data) {
      		
            $scope.showMap=false;
            if (data.city.latitude) {
              $scope.showMap=true;
            }
            $scope.account=data;
            $scope.shareURL = $location.$$absUrl;
            $scope.shareURLEncoded = $location.$$absUrl;
            $scope.twitterShareText="Check out " + data.display_name + " on 2016 Rizers";

            console.log('notify google - profile detail page ' + $location.path());
            sendGA();


      	  });	
      };

      $scope.findCategory = function() {
        
        /* this is called by the category detail page */
        
        $http.get('/api/categories/'+$stateParams.categoryId).success(function(data) {
          $scope.accountList=data.accounts;
          $scope.category=data.category;
          $scope.categoryId=$stateParams.categoryId;

          console.log('notify google - category detail page ' + $location.path());
          sendGA();


        });
      };

      $scope.findCategories = function() {
        /* this is called by the category list view */
        
        $http.get('/api/categories/').success(function(data) {
          $scope.categoryList=data;

          console.log('notify google - category list page ' + $location.path());
          sendGA();
        });
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