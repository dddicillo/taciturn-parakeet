const CustomFlashDirective = function($compile, $rootScope) {
  'ngInject';

  return {
    restrict: 'A',
    template: '<md-toolbar class="md-warn md-short" ng-if="$root.hasFlash"><div class="md-toolbar-tools"><h5 dynamic="$root.flash.text"></h5></div></md-toolbar>',//'../../partials/flashTemplate.html',
    link: function(scope, ele, attrs) {
      $rootScope.flash.timeout = parseInt(attrs.customFlash, 10);
    }
  };
}

export default CustomFlashDirective;
