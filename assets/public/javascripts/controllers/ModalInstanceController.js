class ModalInstanceController {

  constructor($uibModalInstance, $log, Flash, AuthApi) {
    'ngInject';
    this.$uibModalInstance = $uibModalInstance;
    this.$log = $log;
    this.Flash = Flash;
    this.AuthApi = AuthApi;

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
          maxlength: 20
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
    this.Flash.dismiss();

    // Validate Form
    if (this.loginForm.$invalid) {
      this.Flash.create('danger', 'Fix the errors and try again!', 'alert-danger');
      this.loginForm.formly_1_input_username_0.$setTouched();
      this.loginForm.formly_1_input_password_1.$setTouched();
      return;
    }

    this.AuthApi.login(this.credentials.username, this.credentials.password).then(
      (function(res) {
        this.Flash.create(res.data.status, res.data.message);
        if (res.data.success) {

        }
      }).bind(this),
      (function(err) {
        this.Flash.create('danger', 'There was an error logging you in. Try again later');
      }).bind(this));
    return;

    this.$uibModalInstance.close();
  };

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  };
}

export default ModalInstanceController;
