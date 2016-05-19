class SignupController {

  constructor(AuthApi, Flash) {
    'ngInject';
    this.AuthApi = AuthApi;
    this.Flash = Flash;

    this.signupFields = [
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
      },
      {
        key: 'password-confirmation',
        type: 'input',
        templateOptions: {
          type: 'password',
          label: 'Confirm Password',
          required: true,
          minlength: 8
        }
      }
    ];
    this.Flash.dismiss();
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
  }
}

export default SignupController;
