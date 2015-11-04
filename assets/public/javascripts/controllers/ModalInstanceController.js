class ModalInstanceController {

  constructor($uibModalInstance, $log) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.$log = $log;

    this.login = {};
    this.loginFields = [
      {
        key: 'username',
        type: 'input',
        templateOptions: {
          label: 'Username',
          placeholder: 'Username',
          required: true,
          minlength: 6,
          maxlength: 10
        }
      },
      {
        key: 'password',
        type: 'input',
        templateOptions: {
          type: 'password',
          label: 'Password',
          placeholder: 'Password',
          required: true,
          minlength: 8
        }
      }
    ];
  }

  submit() {
    this.$log.info(credentials);
    // TODO: Implement Login Logic

    // Validate Form
    if (vm.loginForm.$invalid) {
      this.$log.info(vm.loginForm.$error);
      this.$log.info(vm.username.$error);
      return;
    }

    this.$uibModalInstance.close();
  };

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  };
}

export default ModalInstanceController;
