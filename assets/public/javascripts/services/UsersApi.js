class UsersApi {

  constructor($http, API) {
    'ngInject';
    this.$http = $http;
    this.prefix = API;
  }

  create(username, password) {
    return this.$http.post(this.prefix + '/users', {
      username,
      password
    });
  }

  list() {
    return this.$http.get(this.prefix + '/users');
  }

  getById(id) {
    return this.$http.get(this.prefix + '/users/' + id);
  }

  updatePassword(password, id) {
    return this.$http.put(this.prefix + '/users/' + id, {
      password
    });
  }

  remove(id) {
    return this.$http.delete(this.prefix + '/users/' + id);
  }
}

export default UsersApi;
