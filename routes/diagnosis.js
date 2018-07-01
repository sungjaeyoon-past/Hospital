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
    //환자상세정보 디비에서 가져옴
    var patientList = [];
    if (req.query.name) {
        var Sql = "SELECT * FROM patient WHERE name ='" + req.query.name + "'";
    } else if (req.query.patient_id) {
        var Sql = "SELECT * FROM patient WHERE patient_id ='" + req.query.patient_id + "'";
    } else if (req.query.personal_number) {
        var Sql = "SELECT * FROM patient WHERE personal_number ='" + req.query.personal_number + "'";
    } else {
        var Sql = 'SELECT * FROM medic.patient';
    }
    await conn.query(Sql, function (err, rows, fields) {
        if (err)
            console.log('Error while performing Query.', err);
        else {
            for (var i = 0; i < rows.length; i++) {
                var person = {
                    'name': rows[i].name,
                    'patient_id': rows[i].patient_id,
                    'personal_number': rows[i].personal_number,
                    'phone_number': rows[i].phone_number
                }
                patientList.push(person);
            }
            res.render('diagnosis/receiptmain', { patientList: patientList });
        }
    });
}));

//메인 화면 및 검색 후 화면
router.get('/', catchErrors(async (req, res, next) => {
    //환자상세정보 디비에서 가져옴
    var patientList = [];
    if (req.query.name) {
        var Sql = "SELECT * FROM patient WHERE name ='" + req.query.name + "'";
    } else if (req.query.patient_id) {
        var Sql = "SELECT * FROM patient WHERE patient_id ='" + req.query.patient_id + "'";
    } else if (req.query.personal_number) {
        var Sql = "SELECT * FROM patient WHERE personal_number ='" + req.query.personal_number + "'";
    } else {
        var Sql = 'SELECT * FROM medic.patient';
    }
    await conn.query(Sql, function (err, rows, fields) {
        if (err)
            console.log('Error while performing Query.', err);
        else {
            for (var i = 0; i < rows.length; i++) {
                var person = {
                    'name': rows[i].name,
                    'patient_id': rows[i].patient_id,
                    'personal_number': rows[i].personal_number,
                    'phone_number': rows[i].phone_number
                }
                patientList.push(person);
            }
            res.render('diagnosis/receiptmain', { patientList: patientList });
        }
    });
}));

//환자를 queue에다 넣음
router.get('/queue/:patient_id', catchErrors(async (req, res, next) => {
    //여기서 patient_id얻구 리다이렉트처리
    console.log("queue에다 넣음");
    res.redirect('/diagnosis');
}));
//환자 접수 취소함
router.get('/dequeue/:patient_id', catchErrors(async (req, res, next) => {
    //여기서 patient_id얻구 리다이렉트처리
    console.log("dequeue에다 넣음");
    res.redirect('/diagnosis');
}));

//순서를 바꿀때 하는 작업입니다.
router.post('/', catchErrors(async (req, res, next) => {
    var action = req.body.action;
    var queue_number = req.body.number;
    console.log(action + queue_number);
}));

module.exports = router;