'use strict';

/* jshint -W098 */
angular.module('mean.rizers').controller('RizersController', ['$scope', 'Global', 'Rizers','$http','$stateParams','$location', 
  function($scope, Global, Rizers,$http,$stateParams,$location) {
      $scope.global = Global;
      $scope.package = {
        name: 'rizers'
      };

      $scope.findAccounts = function() {
        $http.get('/api/accounts/').success(function(data) {
    		  $scope.accounts=data;
    	  });
      };

      $scope.findOneAccount = function() {
        $http.get('/api/accounts/'+ $stateParams.accountId).success(function(data) {
      		
            $scope.showMap=false;
            if (data.city.latitude) {
              $scope.showMap=true;
            }
            $scope.account=data;
            $scope.shareURL = $location.$$absUrl;
            $scope.shareURLEncoded = $location.$$absUrl;
            $scope.twitterShareText="Check out " + data.display_name + " on 2016 Rizers";

            console.log('tell google we went to ' + $location.path());
            ga('set', 'page', $location.path());
            ga('send', 'pageview');


      	  });	
      };

      $scope.findCategory = function() {
        $http.get('/api/categories/'+$stateParams.categoryId).success(function(data) {
          $scope.accountList=data.accounts;
          $scope.category=data.category;
          $scope.categoryId=$stateParams.categoryId;
        });
      };

      $scope.findCategories = function() {
        $http.get('/api/categories/').success(function(data) {
          $scope.categoryList=data;
        });
      };

  }
]);

/**** the following code make the dropdown menu hide when you click anywhere else in the doc ****/
angular.module('mean.rizers').run(function($rootScope) {
  angular.element(document).on("click", function(e) {
      $rootScope.$broadcast("documentClicked", angular.element(e.target));
  });
  $rootScope.$on("documentClicked", function(inner, target) {
    if (!$(target[0]).is(".menu-button") && !$(target[0]).parents(".menu-button").length > 0) {
      document.getElementById("dropdown-nav").classList.remove("show");
    }
  });
});