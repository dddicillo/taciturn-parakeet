class LoginController {

  constructor($uibModal, $log, Flash) {
    'ngInject';
    var vm = this;
    this.$uibModal = $uibModal;
    this.$log = $log;
    this.Flash = Flash;
  }

  open() {
    const modalInstance = this.$uibModal.open({
      templateUrl: 'partials/loginModal.html',
      controller: 'ModalInstanceController',
      controllerAs: 'vm'
    });

    modalInstance.result.then(function () {
    }, (function () {
      this.Flash.dismiss();
    }).bind(this));
  }
}

export default LoginController;
