var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const isAuthenticated = require('../lib/isAuthenticated');
var mysql_dbc = require('../db/db_con')();
var conn = mysql_dbc.init();
var queuelist = [];
queuelist[0] = [];
queuelist[1] = [];
queuelist[2] = [];
queuelist[3] = [];
queuelist[4] = [];
function moveByid(id, action, z) {
    for (var i = 0; i < z.length; i++) {
        if (z[i].patient_id == id) {
            var x = queuelist[dept_id].splice(i, 1);
            var person = {
                name: x[0].name,
                patient_id: x[0].patient_id,
                personal_number: x[0].personal_number,
                phone_number: x[0].phone_number
            }
            queuelist[dept_id].splice(i + action, 0, person);
            return;
        }
    }
}

function deleteByid(id, x) {
    for (var i = 0; i < x.length; i++) {
        if (x[i].patient_id == id) {
            x.splice(i, 1);
            return true;
        }
    }
    return false;
}

function findByid(id, x) {
    for (var i = 0; i < x.length; i++) {
        if (x[i].patient_id == id) {
            return false;
        }
    }
    return true;
}

router.get('/', isAuthenticated, catchErrors(async (req, res, next) => {
    res.redirect('/receipt/4');
}));

router.get('/:dept_id', isAuthenticated, catchErrors(async (req, res, next) => {
    //환자상세정보 디비에서 가져옴
    var patientList = [];
    var dept_id = req.params.dept_id;
    var myqueue = queuelist[dept_id];
    console.log(dept_id);
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
            res.render('diagnosis/receiptmain', { dept_id: dept_id, role: res.locals.currentUser.user_role, queue_number: myqueue.length, queuelist: myqueue, patientList: patientList });
        }
    });
}));

//환자를 queue에다 넣음
router.get('/:dept_id/queue/:patient_id', isAuthenticated, catchErrors(async (req, res, next) => {
    //여기서 patient_id얻구 리다이렉트처리
    console.log("queue에다 넣음");
    var requestPatient = req.params.patient_id;
    var dept_id = req.params.dept_id;
    if (dept_id == 4) {
        req.flash('danger', "과 선택을 먼저 해야합니다.");
        return res.redirect('back');
    }
    if (findByid(requestPatient, queuelist[dept_id])) {
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
                    queuelist[dept_id].push(person);
                }
            }
        });
    } else {
        req.flash('danger', "이미 대기중인 환자 입니다.");
        return res.redirect('back');
    }
    res.redirect('back');
}));

//환자 접수 취소함
router.get('/:dept_id/dequeue/:patient_id', isAuthenticated, catchErrors(async (req, res, next) => {
    //여기서 patient_id얻구 리다이렉트처리
    console.log("dequeue에다 넣음");
    var requestPatient = req.params.patient_id;
    var dept_id = req.params.dept_id;
    if (dept_id == 4) {
        req.flash('danger', "과 선택을 먼저 해야합니다.");
        return res.redirect('back');
    }
    if (!deleteByid(requestPatient, queuelist[dept_id])) {
        req.flash('danger', "삭제할 환자가 없습니다.");
        return res.redirect('back');
    }
    res.redirect('back');
}));

router.get('/:dept_id/next/:patient_id&:loc', isAuthenticated, catchErrors(async (req, res, next) => {
    //여기서 patient_id얻구 리다이렉트처리
    console.log("next 넣음");
    var requestPatient = req.params.patient_id;
    var loc = req.params.loc;
    var dept_id = req.params.dept_id;
    if (dept_id == 4) {
        req.flash('danger', "과 선택을 먼저 해야합니다.");
        return res.redirect('back');
    }
    console.log(loc);
    if (loc != 0) {
        moveByid(requestPatient, -1, queuelist[dept_id]);
    } else {
        req.flash('danger', "더 이상 앞으로 갈 수 없습니다.");
        return res.redirect('back');
    }
    res.redirect('back');
}));

router.get('/:dept_id/prev/:patient_id&:loc', isAuthenticated, catchErrors(async (req, res, next) => {
    //여기서 patient_id얻구 리다이렉트처리
    console.log("prev 넣음");
    var requestPatient = req.params.patient_id;
    var loc = req.params.loc;
    var dept_id = req.params.dept_id;
    var myqueue = queuelist[dept_id];
    if (dept_id == 4) {
        req.flash('danger', "과 선택을 먼저 해야합니다.");
        return res.redirect('back');
    }
    if (loc != myqueue.length - 1) {
        moveByid(requestPatient, 1, myqueue);
    } else {
        req.flash('danger', "더 이상 뒤로 갈 수 없습니다.");
        return res.redirect('back');
    }
    res.redirect('back');
}));

router.get('/queuelist/:dept_id', isAuthenticated, catchErrors(async (req, res, next) => {
    //여기서 patient_id얻구 리다이렉트처리
    var dept_id = req.params.dept_id;
    console.log(queuelist[dept_id]);
    res.json(queuelist[dept_id]);
}));

module.exports = router;