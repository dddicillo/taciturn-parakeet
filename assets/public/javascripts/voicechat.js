import MainController from './controllers/MainController';
import LoginController from './controllers/LoginController';
import LoginDialogController from './controllers/LoginDialogController';
import UsersApi from './services/UsersApi';
import AuthApi from './services/AuthApi';
import CustomFlashDirective from './directives/CustomFlashDirective';
import AuthInterceptor from './interceptors/AuthInterceptor';

(function() {
  'use strict'

  const app = angular.module('voice-chat', [
    'ngRoute',
    'ngMessages',
    'ngStorage',
    'ngAria',
    'ngAnimate',
    'ngMaterial',
    'flash',
    'ui.bootstrap',
    'formly',
    'formlyBootstrap'
  ]);

  app.config(function($routeProvider) {

    $routeProvider
    .when('/', {
      templateUrl: 'partials/home.html'
    })
    .otherwise({
      redirectTo: '/'
    });
  });

  app.controller('MainController', MainController);
  app.controller('LoginController', LoginController);
  app.controller('LoginDialogController', LoginDialogController);

  app.service('UsersApi', UsersApi);
  app.service('AuthApi', AuthApi);

  app.directive('customFlash', CustomFlashDirective);

  app.service('AuthInterceptor', AuthInterceptor);
  app.config(function($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor');
  });

  app.config(function(formlyConfigProvider) {
    formlyConfigProvider.setType({
        name: 'input',
        templateUrl: 'partials/inputTemplate.html',
        overwriteOk: true
    });
    formlyConfigProvider.setWrapper({
      templateUrl: 'partials/formlyWrapper.html'
    });
  });

  app.config(function($localStorageProvider) {
    $localStorageProvider.setKeyPrefix('voicechat');
  });

  app.constant('API', '/api/v1');
})();
