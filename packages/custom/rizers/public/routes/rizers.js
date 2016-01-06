'use strict';

angular.module('mean.rizers').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('detail list of rizers', {
      url: '/accounts/:accountId',
      templateUrl: 'rizers/views/view.html'
    });
  }
]);



/*
angular.module('mean.rizers', ['mean.system'])
.config(['$viewPathProvider', function($viewPathProvider) {
  $viewPathProvider.override('system/views/index.html', 'rizers/views/homepage.html');
}]);
*/

