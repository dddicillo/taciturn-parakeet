class LoginController {

  constructor($uibModal, $log) {
    'ngInject';
    this.$uibModal = $uibModal;
    this.$log = $log;
  }

  open() {
    const modalInstance = this.$uibModal.open({
      templateUrl: 'partials/loginModal.html',
      controller: 'ModalInstanceController',
      controllerAs: 'vm'
    });

    modalInstance.result.then(function (selectedItem) {
    }, function () {
      this.$log.info('Modal dismissed at: ' + new Date());
    });
  }
}

export default LoginController;
