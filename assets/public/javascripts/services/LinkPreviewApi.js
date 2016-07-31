class LinkPreviewApi {

  constructor($http, API, $window) {
    'ngInject';
    this.$http = $http;
    this.prefix = API;
    this.$window = $window;
  }

  getMetadata(url) {
    const endpoint = this.prefix + '/link-preview?url=' + url;
    return this.$http.get(endpoint)
    .then(function(res) {
      return res.data;
    });
  }
}

export default LinkPreviewApi;
