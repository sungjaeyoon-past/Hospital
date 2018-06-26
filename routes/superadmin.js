var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');


//메인 화면 및 superadmin 여부 확인
router.get('/', catchErrors(async (req, res, next) => {
  res.render('superadmin/main');
}));


//사용자 목록, db에서 유저정보 받아옴
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
}));

/* GET home page. */
router.get('/', catchErrors(async (req, res, next) => {
  res.render('employee/staticmain');

}));

module.exports = router;