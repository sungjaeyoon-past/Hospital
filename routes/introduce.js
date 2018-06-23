var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');

router.get('/', function (req, res, next) {
    res.render('introduce');
});

module.exports = router;