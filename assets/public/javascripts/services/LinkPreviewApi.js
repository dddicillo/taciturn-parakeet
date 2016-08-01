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

  extractUrl(str) {
    var re = /(?:(http|https):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost(?=\/)|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/g;
    return str.match(re);
  }
}

export default LinkPreviewApi;
