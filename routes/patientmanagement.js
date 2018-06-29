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

function validateForm(form, option) {
  var name = form.name || "";
  var personal_number = form.personal_number || "";
  var phone_number = form.phone_number || "";
  if (!name) { return "이름을 입력해주세요"; }
  if (!personal_number) { return "주민번호를 입력해주세요"; }
  if (!phone_number) { return "핸드폰 번호를 입력해주세요"; }
}

function getSqlResult(insertSql, callback){
  conn.query(insertSql,function(err,result){
    if(err)
      callback(err,null);
    else
      callback(null,result);
  });
}

function getPersonResult(personList,data){
  for(var i in data){
    var person = {
      'name': data[i].name,
      'personal_number': data[i].personal_number,
      'phone_number': data[i].phone_number,
      'gender': data[i].gender,
      'patient_id': data[i].patient_id
    }
    personList.push(person);
  }
  return personList;
}

/*환자 검색
router.get('/', catchErrors(async (req, res, next) => {

  res.render('');
}));*/

//완성
router.get('/', catchErrors(async (req, res, next) => {
  var personList = [];
  var insertSql="SELECT * FROM patient"
  getSqlResult(insertSql, function(err,data){
    if (err) {
      console.log("ERROR : ",err);            
    } else {          
      personList=getPersonResult(personList,data);  
      res.render('patientmanagement/list', { patients: personList });
    }
  });
}));

//완성
router.get('/inpatient/:id', catchErrors(async (req, res, next) => {
  var person = [];
  var requestPatient=req.params.id;
  var insertSql='SELECT * FROM patient WHERE personal_number=' + requestPatient;
  getSqlResult(insertSql, function(err,data){
    if (err) {
        console.log("ERROR : ",err);            
    }else{
      person=getPersonResult(person,data);
      console.log(person[0]);
      res.render('patientmanagement/inpatient', { patient: person[0] });
    }
  });
}));

router.post('/inpatient/:id', catchErrors(async (req, res, next) => {
  var patient_id=req.params.id;
  var hospital_room = req.body.hospital_room;
  var disease_name = req.body.disease_name;
  var doctor_employee_id=req.body.doctor_employee_id;
  var hospital_day=req.body.hospital_day;
  var insertSql="INSERT INTO inpatient (patient_id, hospital_room, disease_name, doctor_employee_id, hospital_day) VALUES ('"+patient_id+ "','" +hospital_room+ "','" +disease_name+ "','" +doctor_employee_id+ "','" +hospital_day+"')";
  getSqlResult(insertSql, function(err,data){
    if (err) {
        console.log("ERROR : ",err);            
    }else{
      req.flash('success', "추가 성공");
    }
    res.redirect('/patientmanagement');
  });
}));

//완성
router.get('/show/:id', catchErrors(async (req, res, next) => {
  var person = [];
  var requestPatient = req.params.id;
  var insertSql='SELECT * FROM patient WHERE personal_number=' + requestPatient;
  getSqlResult(insertSql, function(err,data){
    if (err) {
        console.log("ERROR : ",err);            
    }else{
      person=getPersonResult(person,data);
      console.log(person[0]);
      res.render('patientmanagement/show', { patient: person[0] });
    }
  });
}));


//완성
router.get('/new', catchErrors(async (req, res, next) => {
  res.render('patientmanagement/new');
}));

//완성
router.post('/new', catchErrors(async (req, res, next) => {
  const err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    console.log(err);
    return res.redirect('back');
  }
  var name = req.body.name;
  var phone_number = req.body.phone_number;
  var personal_number = req.body.personal_number;
  var gender = 0;
  if (req.body.gender = 'female') { gender = 1; }
  var insertSql = "INSERT INTO patient (name, phone_number, personal_number, gender) VALUES ('" +name + "','" + phone_number + "','" + personal_number + "','" + gender + "')";
  getSqlResult(insertSql, function(err,data){
    if (err) {
        console.log("ERROR : ",err);            
    }else{
      req.flash('success', "추가 성공");
    }
    res.redirect('/patientmanagement');
  });
}));

//완성
router.get('/edit/:id', catchErrors(async (req, res, next) => {
  var person = [];
  var requestPatient = req.params.id;
  var insertSql='SELECT * FROM patient WHERE personal_number=' + requestPatient;
  getSqlResult(insertSql, function(err,data){
    if (err) {
        console.log("ERROR : ",err);            
    }else{
      req.flash('success', "추가 성공");
      person=getPersonResult(person,data); 
      res.render('patientmanagement/edit', { patient: person[0] });
    }
  });
}));

//
router.put('/:id', catchErrors(async (req, res, next) => {
  var original_personal_number=req.body.personal_number;
  var name = req.body.name;
  var phone_number = req.body.phone_number;
  var personal_number = req.body.personal_number;
  var gender = 0;
  if (req.body.gender = 'female') { gender = 1; }
  var insertSql = "UPDATE patient SET name='" +name + "', personal_number='" +personal_number + "', phone_number='" +phone_number + "', gender=" +gender + "WHERE personal_number=" + original_personal_number;
  getSqlResult(insertSql, function(err,data){
    if (err) {
        console.log("ERROR : ",err);            
    }else{
      req.flash('success', "변경 성공"); 
      res.redirect('/patientmanagement');
    }
  });
}));

//완성
router.delete('/:id', catchErrors(async (req, res, next) => {
  var insertSql = "DELETE FROM patient WHERE personal_number = '" + req.params.id + "'";
  getSqlResult(insertSql, function(err,data){
    if (err) {
      console.log("ERROR : ",err);            
    } else {          
      console.log(insertSql + "삭제 완료");
    }
    res.redirect('/patientmanagement');
  });
}));

module.exports = router;
