class LoginDialogController {

  constructor($mdDialog, Flash, AuthApi) {
    'ngInject';
    this.$mdDialog = $mdDialog;

    this.Flash = Flash;
    this.AuthApi = AuthApi;

    this.credentials = {};
    this.loginFields = [
      {
        key: 'username',
        type: 'input',
        templateOptions: {
          label: 'Username',
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
          required: true,
          minlength: 8
        }
      }
    ];
    this.Flash.dismiss();
  }

  cancel() {
    this.$mdDialog.cancel();
  }

  submit() {
    this.Flash.dismiss();

    // Validate Form
    if (this.loginForm.$invalid) {
      this.Flash.create('danger', 'Fix the errors and try again!');
      const usernameField = this.loginForm.$name + '_input_username_0';
      const passwordField = this.loginForm.$name + '_input_password_1';
      this.loginForm[usernameField].$setTouched();
      this.loginForm[passwordField].$setTouched();
      return;
    }

    this.AuthApi.login(this.credentials.username, this.credentials.password)
      .then((function(res) {
        this.Flash.create(res.data.status, res.data.message);
        if (res.data.success) {
          this.$mdDialog.hide(true);
        } else {
          this.$mdDialog.hide(res.data);
        }
      }).bind(this))
      .catch((function(err) {
        this.Flash.create('danger', 'There was an error logging you in. Try again later');
      }).bind(this));
    return;
  }
}

export default LoginDialogController;
