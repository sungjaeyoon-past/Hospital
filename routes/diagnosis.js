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
var queuelist = [];
function moveByid(id, action) {
    for (var i = 0; i < queuelist.length; i++) {
        if (queuelist[i].patient_id == id) {
            var x = queuelist.splice(i, 1);
            console.log(x);
            var person = {
                name: x[0].name,
                patient_id: x[0].patient_id,
                personal_number: x[0].personal_number,
                phone_number: x[0].phone_number
            }
            queuelist.splice(i + action, 0, person);
            console.log(queuelist);
            return;
        }
    }
}

function deleteByid(id) {
    for (var i = 0; i < queuelist.length; i++) {
        if (queuelist[i].patient_id == id) {
            queuelist.splice(i, 1);
        }
    }
}

function findByid(id) {
    for (var i = 0; i < queuelist.length; i++) {
        if (queuelist[i].patient_id == id) {
            return false;
        }
    }
    return true;
}

router.get('/', catchErrors(async (req, res, next) => {
    //환자상세정보 디비에서 가져옴
    var patientList = [];
    //console.log(queuelist);
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
            res.render('diagnosis/receiptmain', { queue_number: queuelist.length, queuelist: queuelist.slice(0.5), patientList: patientList });
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
    var requestPatient = req.params.patient_id;
    if (findByid(requestPatient)) {
        var insertSql = 'SELECT * FROM patient WHERE patient_id=' + requestPatient;
        await conn.query(insertSql, function (err, rows, fields) {
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
                    queuelist.push(person);
                }
            }
        });
    }
    res.redirect('/diagnosis');
}));
//환자 접수 취소함
router.get('/dequeue/:patient_id', catchErrors(async (req, res, next) => {
    //여기서 patient_id얻구 리다이렉트처리
    console.log("dequeue에다 넣음");
    var requestPatient = req.params.patient_id;
    deleteByid(requestPatient);
    res.redirect('/diagnosis');
}));

router.get('/next/:patient_id', catchErrors(async (req, res, next) => {
    //여기서 patient_id얻구 리다이렉트처리
    console.log("next 넣음");
    var requestPatient = req.params.patient_id;
    if (requestPatient != 0) {
        moveByid(requestPatient, -1);
    }
    console.log(queuelist);
    res.redirect('/diagnosis');
}));

router.get('/prev/:patient_id', catchErrors(async (req, res, next) => {
    //여기서 patient_id얻구 리다이렉트처리
    console.log("prev 넣음");
    var requestPatient = req.params.patient_id;
    if (requestPatient != queuelist.length) {
        moveByid(requestPatient, 1);
    }
    console.log(queuelist);
    res.redirect('/diagnosis');
}));

module.exports = router;