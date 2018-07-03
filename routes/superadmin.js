var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
var mysql = require('mysql');
var conn = mysql.createConnection({
  host: '58.123.136.107',
  port: '3308',
  user: 'web',
  password: 'mju12345',
  database: 'medic'
});
conn.connect();

function validateForm(form, option) {
  var name = form.name || "";
  var personal_number = form.personal_number || "";
  var phone_number = form.phone_number || "";
  var position = form.position || "";
  var employee_password = form.employee_password || "";

  if (!name) { return "이름 미입력"; }
  if (!personal_number) { return "주민번호 미입력"; }
  if (!phone_number) { return "핸드폰 번호 미입력"; }
  if (!position) { return "직급 미입력"; }
  if (!employee_password) { return "비밀번호 미입력"; }
}

function getSql(insertSql, callback){
  conn.query(insertSql,function(err,result){
    if(err)
      callback(err,null);
    else
      callback(null,result);
  });
}
function getEmp(empList,data){
  for(var i in data){
    var person = {
      'employee_id': data[i].employee_id,
      'name': data[i].name,
      'personal_number': data[i].personal_number,
      'phone_number': data[i].phone_number,
      'gender': data[i].gender,
      'position': data[i].position,
      'employee_password': data[i].employee_password
    }
    empList.push(emp);
  }
  return empList;
}

router.get('/', catchErrors(async (req, res, next) => {
  res.render('superadmin/main');
}));

//사용자 목록, db에서 유저정보 받아옴
router.get('/list', catchErrors(async (req, res, next) => {
  var empList = [];
  conn.query('SELECT * FROM employee', function (err, rows, fields) {
    var emp;
    if (err)
      console.log('Error', err);
    else {
      for (var i in rows) {
        var emp = {
          'employee_id': rows[i].employee_id,
          'name': rows[i].name,
          'personal_number': rows[i].personal_number,
          'phone_number': rows[i].phone_number,
          'gender': rows[i].gender,
          'position': rows[i].position,
          'employee_password': rows[i].employee_password
        }
        empList.push(emp);
      }
      res.render('superadmin/list', {employee: empList, count_emp:rows.length});
    }
  });
}));

//사용자 추가
router.get('/add', catchErrors(async (req, res, next) => {
  res.render('superadmin/add');
}));

router.post('/add', catchErrors(async (req, res, next) => {
  const err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    console.log(err);
    return res.redirect('back');
  }
  var name = req.body.name;
  var personal_number = req.body.personal_number;
  var phone_number = req.body.phone_number;
  var gender = 0;
  if (req.body.gender = 'female') { gender = 1; }
  var position = req.body.position;
  var employee_password = req.body.employee_password;
  var insertSql = "INSERT INTO employee (name, personal_number, phone_number, gender, position, employee_password) VALUES (' "+name+" ', '" +personal_number+" ', ' "+phone_number+" ', ' "+gender+" ','"+position+"','"+employee_password+"')";
  /*conn.query("INSERT INTO employee (name, personal_number, phone_number, gender, position, employee_password) VALUES ('" +name+ "','" + personal_number + "','" + phone_number + "','" + gender + "','"+position+"','"+employee_password+"')", function (err, rows, fields){
    if(err) throw err;
  });*/
  getSql(insertSql, function(err,data){
    if (err) {
        console.log("error",err);
        req.flash('danger', "오류가 발생했습니다.");            
    } else {
      req.flash('success', "유저가 추가되었습니다.");
    }
    res.redirect('/superadmin/list');
  });
}));


//사용자 정보 수정

router.get('/edit', catchErrors(async (req, res, next) => {
  var empList = [];
  conn.query('SELECT * FROM employee', function (err, rows, fields) {
    var emp;
    if (err)
      console.log('Error', err);
    else {
      for (var i in rows) {
        var emp = {

          'name': rows[i].name,
          'personal_number': rows[i].personal_number,
          'phone_number': rows[i].phone_number,
          'gender': rows[i].gender,
          'position': rows[i].position,
          'employee_password': rows[i].employee_password
        }
        empList.push(emp);
      }
      res.render('superadmin/edit', {employee: empList, count_emp:rows.length});
    }
  });
}));


module.exports = router;