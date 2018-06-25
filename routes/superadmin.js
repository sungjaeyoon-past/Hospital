var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');

<<<<<<< HEAD
//메인 화면 및 superadmin 여부 확인
router.get('/', catchErrors(async (req, res, next) => {
  res.render('superadmin/main');
}));


//사용자 목록
router.get('/list', catchErrors(async (req, res, next) => {
  res.render('superadmin/list');
}));

//사용자 정보 수정
router.get('/edit', catchErrors(async (req, res, next) => {
  res.render('superadmin/edit');
}));

//사용자 승인
router.get('/ack', catchErrors(async (req, res, next) => {
  res.render('superadmin/ack');
=======
/* GET home page. */
router.get('/', catchErrors(async (req, res, next) => {
  res.render('employee/staticmain');
>>>>>>> c707b66c8c6f780f57862b65b8f0e45612656469
}));

module.exports = router;
