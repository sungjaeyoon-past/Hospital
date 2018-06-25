var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');

/* GET home page. */
router.get('/', catchErrors(async (req, res, next) => {
  res.render('employee/staticmain');
}));

module.exports = router;
