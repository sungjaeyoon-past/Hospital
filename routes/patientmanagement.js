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
  if(!name){return "이름을 입력해주세요";}
  if(!personal_number){return "주민번호를 입력해주세요";}
  if(!phone_number){return "핸드폰 번호를 입력해주세요";}
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

//완성
router.get('/show/:id', catchErrors(async (req, res, next) => {
  var requestPatient = req.params.id;
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
      }
      console.log(person);
      res.render('patientmanagement/show', { patient:person });
    }
  });
}));

//완성
router.get('/new', catchErrors(async (req, res, next) => {
  res.render('patientmanagement/new');
}));

//완성
router.post('/new', catchErrors(async (req, res, next) => {
  const err=validateForm(req.body);
  if(err){
    req.flash('danger',err);
    console.log(err);
    return res.redirect('back');
  }
  var name=req.body.name;
  var phone_number = req.body.phone_number;
  var personal_number=req.body.personal_number;
  var gender=0;
  if(req.body.gender='female'){gender=1;}
  var insertSql="INSERT INTO patient (name, phone_number, personal_number, gender) VALUES ('"+
  name+"','"+phone_number+"','"+personal_number+"','"+gender+"')";
  console.log(insertSql);
  await conn.query(insertSql,(err, rows, fields) =>{
    if (err)
      console.log("에러:" + err);
    else
      console.log(insertSql +"삽입 완료");
  });
  req.flash('success',"추가 성공");
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
  var insertSql="DELETE FROM patient WHERE personal_number = '"+req.params.id+"'";
  await conn.query(insertSql,(err, rows, fields) =>{
    if (err)
    console.log("에러:" + err);
  else
    console.log(insertSql +"삭제 완료");
  });
  res.redirect('/patientmanagement');
}));

module.exports = router;
