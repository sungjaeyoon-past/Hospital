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
/* GET home page. */
router.get('/', catchErrors(async (req, res, next) => {
  var personList = [];
  conn.connect();
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
      console.log('data is setting');
      res.render('patientmanagement/monitor2', { "personList": personList });
    }
  });
  conn.end();
}));

module.exports = router;
