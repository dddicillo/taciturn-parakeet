import MainController from './controllers/MainController';
import LoginDialogController from './controllers/LoginDialogController';
import SignupController from './controllers/SignupController';
import ChatController from './controllers/ChatController';
import UsersApi from './services/UsersApi';
import AuthApi from './services/AuthApi';
import Socket from './services/Socket';
import MediaStream from './services/MediaStream';
import PeerConnection from './services/PeerConnection';
import ChatRoom from './services/ChatRoom';
import CustomFlashDirective from './directives/CustomFlashDirective';
import AuthInterceptor from './interceptors/AuthInterceptor';

(function() {
  'use strict'

  const app = angular.module('voice-chat', [
    'ui.router',
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

  // Configure routes
  app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/home.html',
        authenticate: false
      })
      .state('chat', {
        url: '/chat',
        templateUrl: 'partials/chat.html',
        controller: 'ChatController as vm',
        authenticate: true
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'partials/signup.html',
        controller: 'SignupController',
        controllerAs: 'vm',
        authenticate: false
      });

    $urlRouterProvider.otherwise('/');
  });

  // Require authentication
  app.run(function($rootScope, $state, AuthApi) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      if (toState.authenticate && !AuthApi.isAuthed()) {
        $state.transitionTo('home');
        event.preventDefault();
      }

      if (toState.url === '/' && AuthApi.isAuthed()) {
        $state.transitionTo('chat');
        event.preventDefault();
      }
    });
  });

  app.controller('MainController', MainController);
  app.controller('LoginDialogController', LoginDialogController);
  app.controller('SignupController', SignupController);
  app.controller('ChatController', ChatController);

  app.service('UsersApi', UsersApi);
  app.service('AuthApi', AuthApi);
  app.service('Socket', Socket);
  app.service('MediaStream', MediaStream);
  app.service('PeerConnection', PeerConnection);
  app.service('ChatRoom', ChatRoom);

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

  app.filter("trustUrl", ['$sce', function ($sce) {
        return function (recordingUrl) {
            return $sce.trustAsResourceUrl(recordingUrl);
        };
    }]);
})();
