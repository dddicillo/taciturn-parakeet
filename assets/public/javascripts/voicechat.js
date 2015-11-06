import LoginController from './controllers/LoginController';
import ModalInstanceController from './controllers/ModalInstanceController';
import UsersApi from './services/UsersApi';
import AuthApi from './services/AuthApi';
import AuthInterceptor from './interceptors/AuthInterceptor';

(function() {
  'use strict'

  const app = angular.module('voice-chat', [
    'ngRoute',
    'ngMessages',
    'ngStorage',
    'flash',
    'ui.bootstrap',
    'formly',
    'formlyBootstrap'
  ]);

  app.config(['$routeProvider', 'formlyConfigProvider', '$localStorageProvider',
  function($routeProvider, formlyConfigProvider, $localStorageProvider) {

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

    $localStorageProvider.setKeyPrefix('voicechat');
  }]);

  app.controller('LoginController', LoginController);
  app.controller('ModalInstanceController', ModalInstanceController);

  app.service('UsersApi', UsersApi);
  app.service('AuthApi', AuthApi);

  app.service('AuthInterceptor', AuthInterceptor);
  app.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });

  app.constant('API', '/api/v1');
})();
