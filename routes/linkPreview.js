var express = require('express');
var router = express.Router();
var previewService = require('../services/linkPreviewService');

router.get('/link-preview', function(req, res, next) {
  var url;
  if (url = req.query.url) {
    previewService.preview(url)
      .then(function(linkInfo) {
        res.json(linkInfo);
      })
      .catch(function(err) {
        res.status(404).json(err);
      });
  } else {
    res.sendStatus(400);
  }
});

module.exports = router;
