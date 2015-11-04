import LoginController from './controllers/LoginController';
import ModalInstanceController from './controllers/ModalInstanceController';

(function() {
  'use strict'

  const app = angular.module('voice-chat', [
    'ngRoute',
    'ngMessages',
    'flash',
    'ui.bootstrap',
    'formly',
    'formlyBootstrap'
  ]);

  app.config(['$routeProvider', 'formlyConfigProvider',
  function($routeProvider, formlyConfigProvider) {

    $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html'
    })
    .otherwise({
      redirectTo: '/'
    });

    formlyConfigProvider.setType({
        name: 'input',
        templateUrl: 'partials/inputTemplate.html',
        overwriteOk: true
    });
    formlyConfigProvider.setWrapper({
      templateUrl: 'partials/formlyWrapper.html'
    });
  }]);

  app.controller('LoginController', LoginController);
  app.controller('ModalInstanceController', ModalInstanceController);
})();
