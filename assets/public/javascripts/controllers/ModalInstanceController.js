class ModalInstanceController {

  constructor($uibModalInstance, $log, Flash) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.$log = $log;
    this.Flash = Flash;

    this.credentials = {};
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
    this.$log.info(this.credentials);
    // TODO: Implement Login Logic

    // Validate Form
    if (this.loginForm.$invalid) {
      this.Flash.create('danger', 'Fix the errors and try again!', 'alert-danger');
      return;
    }

    this.$uibModalInstance.close();
  };

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  };
}

export default ModalInstanceController;
