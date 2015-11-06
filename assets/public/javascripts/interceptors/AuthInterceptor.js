let self;

class AuthInterceptor {

  constructor(API, $injector) {
    'ngInject';
    self = this;
    self.API = API;
    self.$injector = $injector;
  }

  request(config) {
    const AuthApi = self.$injector.get('AuthApi');
    const token = AuthApi.getToken();
    if(config.url.indexOf(self.API) === 0 && token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }

  response(res) {
    if(res.config.url.indexOf(self.API) === 0 && res.data.token) {
      const AuthApi = self.$injector.get('AuthApi');
      AuthApi.saveToken(res.data.token);
    }

    return res;
  }
}

export default AuthInterceptor;
