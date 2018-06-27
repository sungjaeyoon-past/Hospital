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
router.get('/json', catchErrors(async (req, res, next) => {
  var userList = [];
  await conn.query('SELECT * FROM user', function (err, rows, fields) {
    var user;
    if (err)
      console.log('Error while performing Query.', err);
    else {
      for (var i = 0; i < rows.length; i++) {
        // superadmin일 경우 edit 버튼 활성화
        var edit = "";
        var user = {
          //if (rows[i].superadmin == 1) edit += "EDIT"
          'user_number': rows[i].user_number,
          'user_id': rows[i].user_id,
          'user_name': rows[i].user_name,
          'user_password': rows[i].user_password,
          'edit': edit
        }
        userList.push(user);
      }
      res.json(userList);
    }
  });
}));

//사용자 정보 수정
//사용자 admin 승급은 정보 수정에서 함께 한다
router.get('/edit', catchErrors(async (req, res, next) => {
  res.render('superadmin/edit');
}));


module.exports = router;