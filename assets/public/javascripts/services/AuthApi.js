class AuthApi {

  constructor($http, $localStorage, API) {
    'ngInject';
    this.$http = $http;
    this.$localStorage = $localStorage;
    this.prefix = API;
  }

  login(username, password) {
    return this.$http.post(this.prefix + '/login', {
      username,
      password
    });
  }

  logout() {
    delete this.$localStorage.token;
  }

  isAuthed() {
    const token = this.getToken();

    if (token) {
      const params = this.parseToken(token);
      return Math.round(new Date().getTime() / 1000) <= params.exp;
    } else {
      return false;
    }
  }

  parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse($window.atob(base64));
  }

  saveToken(token) {
    this.$localStorage.token = token;
  }

  getToken() {
    return this.$localStorage.token;
  }
}

export default AuthApi;
