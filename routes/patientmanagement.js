var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');

/* GET home page. */
router.get('/', catchErrors(async (req, res, next) => {
  res.render('patientmanagement/main');
}));

/*환자 검색
router.get('/', catchErrors(async (req, res, next) => {

  res.render('');
}));*/

//---------------------환자 목록---------------------------------------------
router.get('/list', catchErrors(async (req, res, next) => {
  res.render('patientmanagement/list');
}));

//----------------------환자 상세정보-----------------------------------------
router.get('/:id', catchErrors(async (req, res, next) => {
  //환자상세정보 디비에서 가져옴
  res.render('patientmanagement/show');
}));

//----------------------환자 추가----------------------------------------------
router.get('/new', catchErrors(async (req, res, next) => {
  res.render('patientmanagement/new');
}));

router.post('/new', catchErrors(async (req, res, next) => {
  //디비에 저장
  //저장 성공실패여부
  res.render('patientmanagement/main');
}));

//------------------------환자 정보수정------------------------------------------
router.get('/:id/edit', catchErrors(async (req, res, next) => {
  //정보보여줌
  res.render('patientmanagement/edit');
}));

router.put('/:id', catchErrors(async (req, res, next) => {
  //id 값을 찾아서 업데이트
  //저장 성공실패여부
  res.render('patientmanagement/main');
}));

//---------------------------환자 삭제-------------------------------------------
router.delete('/:id', catchErrors(async (req, res, next) => {
  //id 값을 찾아서 ddelete
  //저장 성공실패여부
  res.render('patientmanagement/main');
}));

module.exports = router;
