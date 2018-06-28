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
      res.render('superadmin/list', {employee: empList});
    }
  });
}));

//사용자 정보 수정
//사용자 admin 승급은 정보 수정에서 함께 한다
router.get('/edit', catchErrors(async (req, res, next) => {
  res.render('superadmin/edit');
}));


module.exports = router;