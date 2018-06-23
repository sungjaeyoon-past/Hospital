var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');

/* GET home page. */
router.get('/', catchErrors(async (req, res, next) => {
  res.render('index');
}));

router.get('/', function(req, res, next) {
  res.sendFile(__dirname + "/main.html");
});

module.exports = router;
