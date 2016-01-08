'use strict';

/* jshint -W098 */
angular.module('mean.rizers').controller('RizersController', ['$scope', 'Global', 'Rizers','$http','$stateParams', 
  function($scope, Global, Rizers,$http,$stateParams) {
      $scope.global = Global;
      $scope.package = {
        name: 'rizers'
      };

      $scope.findAccounts = function() {
        $http.get('/api/accounts/').success(function(data) {
    		  $scope.accounts=data;
    	  });
      };

      $scope.findOne = function() {
        $http.get('/api/accounts/'+ $stateParams.accountId).success(function(data) {
      		$scope.account=data;
      	  });	
      };

      $scope.findCategory = function() {
        $http.get('/api/accounts/').success(function(data) {
          $scope.accountList=data;
          $scope.categoryId=$stateParams.categoryId;
          $scope.filterByCategory=$stateParams.categoryId;
        });
      };

      $scope.findCategories = function() {
        $http.get('/api/categories/').success(function(data) {
          $scope.categoryList=data;
        });
      };

  }
]);
