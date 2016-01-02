'use strict';

/* jshint -W098 */
angular.module('mean.rizers').controller('RizersController', ['$scope', 'Global', 'Rizers','$http','$stateParams', 
  function($scope, Global, Rizers,$http,$stateParams) {
    $scope.global = Global;
    $scope.package = {
      name: 'rizers'
    };

    $scope.find = function() {
      $http.get('/api/accounts/').success(function(data) {
		$scope.accounts=data;
	  });
    };

    $scope.findOne = function() {
      console.log('one id is ' +  $stateParams.accountId);
      $http.get('/api/accounts/'+ $stateParams.accountId).success(function(data) {
		$scope.account=data;
	  });	

    };

  }
]);
