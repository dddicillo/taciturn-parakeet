var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout');
});

/* TEST: This should be removed once the GUM functionality is in place */
router.get('/test', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../views/testGum.html'));
});

module.exports = router;
