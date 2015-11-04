(function() {
  'use strict'

  angular.module('voice-chat')
  .directive('validateForm', function() {
    return {
      restrict: 'A',
      require:  '^form',
      link: function (scope, elem, attrs, formCtrl) {
        const inputEl   = elem[0].querySelector("[name]");
        const inputNgEl = angular.element(inputEl);
        const inputName = inputNgEl.attr('name');

        inputNgEl.bind('blur', function() {
          elem.toggleClass('has-error', formCtrl[inputName].$invalid);
        })
      }
    }
  });
})();
