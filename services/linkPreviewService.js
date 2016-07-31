var rp = require('request-promise');
var cheerio = require('cheerio');
var urlParser = require('url');
var StringBuilder = require('string-builder');

linkPreviewService = {

  preview: function(url) {
    this.parsedUrl = urlParser.parse(url);
    return this.getDom(url)
      .then((function($) {
        return this.extractMetadata($);
      }).bind(this));
  },

  getDom: function(url) {
    options = {
      uri: url,
      transform: function(body) {
        return cheerio.load(body);
      }
    }
    return rp(options);
  },

  extractMetadata: function($) {
    return {
      title: this.getTitle($),
      description: this.getDescription($),
      images: this.getImages($),
      video: undefined,
      sitename: this.getSitename($),
      hostname: this.getHostname(),
      favicon: this.getFavicon()
    }
  },

  getTitle: function($) {
    return $('meta[property="og:title"]').attr('content') ||
      $('title').text() ||
      $('meta[name="title"]').attr('content');
  },

  getDescription: function($) {
    return $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('div .description').text();
  },

  getImages: function($) {
    var imageSrc = $('meta[property="og:image"]').attr('content') ||
      $('meta[itemprop="image"]').attr('content') ||
      $('link[rel="image_src"]').attr('content');

    return imageSrc;
  },

  getSitename: function($) {
    return $('meta[property="og:site_name"]').attr('content');
  },

  getHostname: function() {
    return this.parsedUrl.hostname;
  },

  getFavicon: function() {
    var sb = new StringBuilder();
    sb.append(this.parsedUrl.protocol);
    sb.append('//' + this.parsedUrl.hostname);
    if (this.parsedUrl.port) sb.append(':' + this.parsedUrl.port);
    sb.append('/favicon.ico');
    return sb.toString();
  }
}

module.exports = linkPreviewService;
