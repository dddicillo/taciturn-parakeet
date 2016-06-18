var rp = require('request-promise');
var cheerio = require('cheerio');

linkPreviewService = {

  preview: function(url) {
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
      video: undefined
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
  }
}

module.exports = linkPreviewService;
