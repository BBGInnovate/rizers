'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global','$http',
  function($scope, Global,$http) {
	$scope.global = Global;
	
	/* fetch our master list of rizers */
	$http.get('/api/accounts/').success(function(data) {
		$scope.accountList=data;
		  $scope.filterAccount="";
	});
  }
]);


