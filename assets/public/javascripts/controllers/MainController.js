class MainController {

  constructor(AuthApi, $mdDialog) {
    'ngInject';
    this.AuthApi = AuthApi;
    this.$mdDialog = $mdDialog;
  }

  isAuthed() {
    return this.AuthApi.isAuthed();
  }

  showLogin(event) {
    this.$mdDialog.show({
      controller: 'LoginDialogController',
      controllerAs: 'vm',
      templateUrl: 'partials/loginModal.html',
      parent: angular.element(document.body),
      targetEvent: event,
      clickOutsideToClose:true
    })
    .then(function(answer) {

    }, function() {

    });
  }

  showLogout(event) {
    var confirm = this.$mdDialog.confirm()
      .title('Really?')
      .content('Are you sure you want to logout?')
      .targetEvent(event)
      .ok('Yes')
      .cancel('No');

    this.$mdDialog.show(confirm).then((function() {
      this.AuthApi.logout();
    }).bind(this));
  }
}

export default MainController;
