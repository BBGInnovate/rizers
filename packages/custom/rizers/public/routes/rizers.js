'use strict';

angular.module('mean.rizers').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('detail list of rizers', {
      url: '/accounts/:accountId',
      templateUrl: 'rizers/views/profileDetail.html'
    }).state('category Detail view', {
      url: '/categories/:categoryId',
      templateUrl: 'rizers/views/categoryDetail.html'
    }).state('Account List', {
      url: '/accounts',
      templateUrl: 'rizers/views/accountListFull.html'
    });
  }

]);



/*
angular.module('mean.rizers', ['mean.system'])
.config(['$viewPathProvider', function($viewPathProvider) {
  $viewPathProvider.override('system/views/index.html', 'rizers/views/homepage.html');
}]);
*/

