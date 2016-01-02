'use strict';

angular.module('mean.rizers').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('detail list of rizers', {
      url: '/accounts/:accountId',
      templateUrl: 'rizers/views/view.html'
    });
  }
]);


