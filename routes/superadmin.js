var express = require('express');
var router = express.Router();

const catchErrors = require('../lib/async-error');
const isAuthenticated = require('../lib/isAuthenticated');
var mysql_dbc = require('../db/db_con')();
var conn = mysql_dbc.init();

function validateForm(form, option) {
  var name = form.name || "";
  var personal_number = form.personal_number || "";
  var phone_number = form.phone_number || "";
  var position = form.position || "";
  var department_id = form.department_id || "";

  if (!name) { return "이름 미입력"; }
  if (!personal_number) { return "주민번호 미입력"; }
  if (!phone_number) { return "핸드폰 번호 미입력"; }
  if (!position) { return "직급 미입력"; }
  if (!department_id) { return "과 번호 미입력"; }
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
    var emp = {
      'employee_id': data[i].employee_id,
      'name': data[i].name,
      'personal_number': data[i].personal_number,
      'phone_number': data[i].phone_number,
      'gender': data[i].gender,
      'position': data[i].position,
      'department_id': data[i].department_id
    }
    empList.push(emp);
  }
  return empList;
}

router.get('/', isAuthenticated, catchErrors(async (req, res, next) => {
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
          'department_id': rows[i].department_id
        }
        empList.push(emp);
      }
      res.render('superadmin/list', {role: res.locals.currentUser.user_role, employee: empList, count_emp:rows.length});
    }
  });
}));

//사용자 추가
router.get('/add', isAuthenticated, catchErrors(async (req, res, next) => {
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
  var gen = "남자";
  if (req.body.gender = 'female') { gender = 1; gen = "여자";}

  var position = 0;
  if (req.body.position = 'nurse') { position = 1;}
  var department_id = req.body.department_id;
  var insertSql = "INSERT INTO employee (name, personal_number, phone_number, gender, position, department_id) VALUES (' "+name+" ', '" +personal_number+" ', ' "+phone_number+" ', ' "+gender+" ','"+position+"','"+department_id+"')";
  
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


router.get('/edit/:id', isAuthenticated, catchErrors(async (req, res, next) => {
  var employee = [];
  var reqEmp = req.params.id;
  var insertSql = 'SELECT * FROM employee WHERE employee_id='+ reqEmp;

  getSql(insertSql, function(err, data){
    if(err){
      console.log("error", err);
    } else {
      req.flash('success', "추가");
      employee = getEmp(employee,data);
      res.render('superadmin/edit', {role: res.locals.currentUser.user_role, emp: employee[0] });
    }
  });
}));

router.put('/edit/:id', isAuthenticated, catchErrors(async (req, res, next) => {
  var employee_id = req.params.id;
  var name = req.body.name;
  var personal_number = req.body.personal_number;
  var phone_number = req.body.phone_number;
  var gender = 0;
  if (req.body.gender = 'female') { gender = 1; }
  var position = req.body.position;
  var insertSql = "UPDATE employee SET name='" + name + "', personal_number='" + personal_number + "', phone_number='" + phone_number + "', gender='" + gender +"', position='" + position + "' WHERE employee_id=" + employee_id;
  
  console.log(insertSql);
  getSql(insertSql, function(err,data){
    if(err){
      console.log("error", err);
      req.flash('danger', "오류가 발생했습니다.");
    } else {
      req.flash('success', "수정되었습니다.");
      res.redirect('/superadmin/list');
    }
  });
}));

module.exports = router;