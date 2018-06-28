var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: '58.123.136.107',
  port: '3308',
  user: 'web',
  password: 'mju12345',
  database: 'medic'
});
conn.connect();
const catchErrors = require('../lib/async-error');

function validateForm(form , option){
  var name = form.name||"";
  var personal_number = form.personal_number||"";
  var phone_number = form.phone_number||"";
  var gender = form.gender||"";
  if(!name){return "이름을 입력해주세요";}
  if(!personal_number){return "주민번호를 입력해주세요";}
  if(!phone_number){return "핸드폰 번호를 입력해주세요";}
  if(!gender){return "성별을 선택해주세요";}
}

/*환자 검색
router.get('/', catchErrors(async (req, res, next) => {

  res.render('');
}));*/

//완성
router.get('/', catchErrors(async (req, res, next) => {
  var personList = [];
  conn.query('SELECT * FROM patient', (err, rows, fields) => {
    var person;
    if (err)
      console.log("에러:" + err);
    else {
      for (var i in rows) {
        var person = {
          'name': rows[i].name,
          'personal_number': rows[i].personal_number,
          'phone_number': rows[i].phone_number,
          'gender': rows[i].gender,
          'patient_id': rows[i].patient_id,
        }
        personList.push(person);
      }
      res.render('patientmanagement/list', { patients: personList });
    }
  });
}));

//!
router.get('/show/:id', catchErrors(async (req, res, next) => {
  //환자상세정보 디비에서 가져옴
  var requestPatient = req.params.id;
  var personList = [];
  conn.query('SELECT * FROM patient WHERE personal_number=' + requestPatient, (err, rows, fields) => {
    var person;
    if (err)
      console.log("에러:" + err);
    else {
      for (var i in rows) {
        var person = {
          'name': rows[i].name,
          'personal_number': rows[i].personal_number,
          'phone_number': rows[i].phone_number,
          'gender': rows[i].gender,
          'patient_id': rows[i].patient_id,
        }
        personList.push(person);
      }
      res.render('patientmanagement/show', { patients: personList });
    }
  });
}));

//완성
router.get('/new', catchErrors(async (req, res, next) => {
  res.render('patientmanagement/new');
}));

//!
router.post('/new', catchErrors(async (req, res, next) => {
  /*const err=validateForm(req.body);
  if(err){
    req.flash('danger',err);
    console.log(err);
    return res.redirect('back');
  }*/
  var name=req.body.name;
  console.log(name);
  var personal_number=req.body.personal_number;
  var phone_number = req.body.phone_number;
  var gender =0;// req.body.gender;
  var insertSql="INSERT INTO patient (name, personal_number, phone_number, gender) VALUES ('"+name+"','"+personal_number+"','"+phone_number+"','"+gender+"')";
  /*await conn.query(insertSql,(err, rows, fields) =>{
    if (err)
      console.log("에러:" + err);
    else
      console.log(insertSql +"삽입 완료");
  });*/
  res.redirect('/patientmanagement');
}));

//------------------------환자 정보수정------------------------------------------
router.get('/:id/edit', catchErrors(async (req, res, next) => {
  //정보보여줌
  res.redirect('/patientmanagement');
}));

router.put('/:id', catchErrors(async (req, res, next) => {
  //id 값을 찾아서 업데이트
  //저장 성공실패여부
  res.redirect('/patientmanagement');
}));

//---------------------------환자 삭제-------------------------------------------
router.delete('/:id', catchErrors(async (req, res, next) => {
  //id 값을 찾아서 ddelete
  //저장 성공실패여부
  res.redirect('/patientmanagement');
}));

module.exports = router;
