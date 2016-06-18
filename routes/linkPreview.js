var express = require('express');
var router = express.Router();
var previewService = require('../services/linkPreviewService');

router.get('/', function(req, res, next) {
  var url;
  if (url = req.query.url) {
    previewService.preview(url)
      .then(function(linkInfo) {
        console.log(linkInfo);
        res.json(linkInfo);
      })
      .catch(function(err) {
        res.json(err);
      });
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
