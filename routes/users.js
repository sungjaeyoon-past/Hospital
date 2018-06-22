var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(__dirname + "public/main.html");
});

module.exports = router;
