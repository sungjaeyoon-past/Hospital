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

//환자관리 눌렀을 때 보여주는곳+ 환자 검색 (완)
router.get('/', catchErrors(async (req, res, next) => {
  if(req.query.name){
    console.log(req.query.name);
    var insertSql="SELECT * FROM patient WHERE name ='"+req.query.name+"'";
  }else{
    console.log("이름요청x");
    var insertSql="SELECT * FROM patient"
  }
  var personList = [];
  getSqlResult(insertSql, function(err,data){
    if (err) {
      console.log("ERROR : ",err);            
    } else {          
      personList=getPersonResult(personList,data);  
      res.render('patientmanagement/list', { patients: personList });
    }
  });
}));

//입원 클릭했을시 입원수속 보여주는곳 (완)
router.get('/inpatient/:id', catchErrors(async (req, res, next) => {
  var person = [];
  var requestPatient=req.params.id;
  var insertSql='SELECT * FROM patient WHERE personal_number=' + requestPatient;
  getSqlResult(insertSql, function(err,data){
    if (err) {
        console.log("ERROR : ",err);            
    }else{
      person=getPersonResult(person,data);
      res.render('patientmanagement/inpatient', { patient: person[0] });
    }
  });
}));

//입원 수속 완료후 입원 추가 (완)
router.post('/inpatient/:id', catchErrors(async (req, res, next) => {
  var patient_id=req.params.id;
  var hospital_room = req.body.hospital_room;
  var bed_no=req.body.bed_no;
  var disease_name = req.body.disease_name;
  var doctor_employee_id=req.body.doctor_employee_id;
  var hospital_day=req.body.hospital_day;
  var insertSql="INSERT INTO inpatient (patient_id, hospital_room, bed_no, disease_name, doctor_employee_id, hospital_day) VALUES ('"+patient_id+ "','" +hospital_room+ "','"+bed_no+"','"+disease_name+ "','" +doctor_employee_id+ "','" +hospital_day+"')";
  getSqlResult(insertSql, function(err,data){
    if (err) {
        console.log("ERROR : ",err);            
    }else{
      req.flash('success', "추가 성공");
    }
    res.redirect('/patientmanagement');
  });
}));

//퇴원 수속 (완)
router.delete('/inpatient/:id', catchErrors(async (req, res, next) => {
  var insertSql="DELETE FROM inpatient WHERE patient_id = '"+req.params.id+"'"; 
  getSqlResult(insertSql, function(err,data){
    if (err) {
        console.log("ERROR : ",err);            
    }else{
      req.flash('success', "퇴원 성공");
    }
    res.redirect('/patientmanagement');
  });
}));

//상세보기를 눌렀을 경우 보여주는곳 (완)
router.get('/show/:id', catchErrors(async (req, res, next) => {
  var person = [];
  var requestPatient = req.params.id;
  var insertSql='SELECT * FROM patient WHERE personal_number=' + requestPatient;
  getSqlResult(insertSql, function(err,data){
    if (err) {
        console.log("ERROR : ",err);            
    }else{
      person=getPersonResult(person,data);
      res.render('patientmanagement/show', { patient: person[0] });
    }
  });
}));


//환자 추가눌렀을 때 (완)
router.get('/new', catchErrors(async (req, res, next) => {
  res.render('patientmanagement/new');
}));

//환자 추가를 했을 때 (완)
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

//환자 정보 변경 눌렀을 경우 (?)->pug에 기존값 넣기
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

//환자 정보 변경 했을 경우 (완)
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

//환자 정보를 삭제 (완)
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
