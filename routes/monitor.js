var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const isAuthenticated = require('../lib/isAuthenticated');
var mysql_dbc = require('../db/db_con')();
var conn = mysql_dbc.init();

/* GET home page. */

/*
  먼저 CON에서 쿼리문을 따와서 JSON객체를 만들고
  JSON객체를 다른 URL로 해서 주고
  AJAX로 값을 받음
  그 URL을 주기적으로 참고하여 TABLE을 그림
  그리고 주기적으로 정보 갱신(AJAX RELOAD)
  만약 진짜 realtime구현하려면 timestamp값 대조로 가능
*/
router.get('/', isAuthenticated, catchErrors(async (req, res, next) => {
  console.log(res.locals.currentUser.user_id);
  console.log(res.locals.currentUser.user_role);
  res.render('monitor/monitor2', { role: res.locals.currentUser.user_role });
}));

//---------------------JSON객체 전달-------------------------//
router.get('/json', catchErrors(async (req, res, next) => {
  //환자상세정보 디비에서 가져옴
  var personList = [];
  await conn.query('SELECT * FROM monitoring', function (err, rows, fields) {
    var person;
    if (err)
      console.log('Error while performing Query.', err);
    else {
      for (var i = 0; i < rows.length; i++) {
        var attention = "";
        if (rows[i].is_empty == 1) attention += "링거"
        if (rows[i].is_wet == 1) attention += "기저귀"
        if (rows[i].weight_sensor == 1) attention += "낙상"
        var person = {
          'name': rows[i].name,
          'patient_id': rows[i].patient_id,
          'hospital_room': rows[i].hospital_room,
          'temperature': rows[i].temperature,
          'humidity': rows[i].humidity,
          'attention': attention,
        }
        personList.push(person);
      }
      res.json(personList);
    }
  });
}));

module.exports = router;
