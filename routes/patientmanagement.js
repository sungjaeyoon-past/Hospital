var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: '58.123.136.107',
  port: '3308',
  user: 'web',
  password: 'mju12345',
  database : 'medic'
});
conn.connect();
const catchErrors = require('../lib/async-error');

/* GET home page. */
router.get('/', catchErrors(async (req, res, next) => {
  conn.query('SELECT name FROM patient',function(err, rows, fields) {
    if (!err)
      console.log(rows);
    else
      console.log(err);
  });
  res.render('patientmanagement/main');
}));

/*환자 검색
router.get('/', catchErrors(async (req, res, next) => {

  res.render('');
}));*/

//---------------------환자 목록---------------------------------------------
router.get('/list', catchErrors(async (req, res, next) => {
  var personList = [];
  conn.query('SELECT * FROM patient', function (err, rows, fields) {
    var person;
    if (err)
      console.log("에러:"+err);
    else {
      for (var i = 0; i < rows.length; i++) {
        var person = {
          'name': rows[i].name,
          'personal_number': rows[i].personal_number,
          'phone_number': rows[i].phone_number,
          'gender': rows[i].gender,
          'patient_id': rows[i].patient_id,
        }
        personList.push(person);
      }
      console.log(personList);
      res.render('patientmanagement/list', { patients: personList });
    }
  });
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
