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

/* GET home page. */

/*
  먼저 CON에서 쿼리문을 따와서 JSON객체를 만들고(완료)
  JSON객체를 다른 URL로 해서 주고(완료)
  AJAX로 값을 받음(완료)
  그 URL을 주기적으로 참고하여 TABLE을 그림(https://datatables.net/examples/data_sources/ajax.html)
  그리고 주기적으로 다시 그려줌(AJAX TIMEOUT - 2초:미완료-http://link2me.tistory.com/1139)
*/
router.get('/', catchErrors(async (req, res, next) => {
  res.render('monitor/monitor2');
}));

//---------------------JSON객체 전달-------------------------//
router.get('/json', catchErrors(async (req, res, next) => {
  //환자상세정보 디비에서 가져옴
  var personList = [];
  conn.query('SELECT * FROM patient', function (err, rows, fields) {
    var person;
    if (err)
      console.log('Error while performing Query.', err);
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
      res.json(personList);
    }
  });
}));

module.exports = router;
