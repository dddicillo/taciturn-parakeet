class MainController {

  constructor(AuthApi, $mdDialog, $state, $mdSidenav, $mdMedia) {
    'ngInject';
    this.AuthApi = AuthApi;
    this.$mdDialog = $mdDialog;
    this.$state = $state;
    this.$mdSidenav = $mdSidenav;
    this.$mdMedia = $mdMedia;
  }

  isAuthed() {
    return this.AuthApi.isAuthed();
  }

  isCover() {
    return this.$state.current.name === "home";
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
    .then((function(success) {
      console.log(success);
      if (success) {
        this.$state.transitionTo('chat');
      }
    }).bind(this));
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
      this.$state.transitionTo('home');
    }).bind(this));
  }

  toggleNav() {
    this.$mdSidenav('nav').toggle();
  }
}

export default MainController;
