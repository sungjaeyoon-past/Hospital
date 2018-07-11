var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const isAuthenticated = require('../lib/isAuthenticated');
var mysql_dbc = require('../db/db_con')();
var conn = mysql_dbc.init();

function query(sql, args) {
    return new Promise((resolve, reject) => {
        conn.query(sql, args, (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
}

function checkValidate(form) {
    return new Promise((resolve, reject) => {
        var msg = validateFormReceipt(form);
        if (msg != "")
            return reject();
        resolve();
    })
}

function validateFormReceipt(form) {
    var errlog = "";
    var patient_id = form.patient_id;
    var date = form.date;
    var disease = form.disease;
    var description = form.description;

    if (date == null) errlog += "날짜 "
    if (disease == null) errlog += "질병 이름 "
    if (description == null) errlog += "진료 내용 "
    if (patient_id == null) errlog += "환자 번호 "
    return errlog;
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function getDeptName(dept_id) {
    if (dept_id == 1) return '안과';
    else if (dept_id == 2) return '내과';
    else if (dept_id == 3) return '외과';
    else if (dept_id == 4) return '치과';
    return 'error';
}


//진료 접수 메인 페이지
router.get('/', isAuthenticated, catchErrors(async (req, res, next) => {
    if (res.locals.currentUser.user_role != 1) res.redirect('/');
    var date = getDate();
    var sql = "SELECT * FROM medic.employee where employee_id=" + res.locals.currentUser.user_information;
    await conn.query(sql, function (err, result) {
        if (err)
            console.log('Error while performing Query.', err);
        else {
            var doc = {
                dept_id: result[0].department_id - 1,
                name: result[0].name,
                department: getDeptName(result[0].department_id)
            }
            res.render('receipt/receiptmain', { doc: doc, date: date, role: res.locals.currentUser.user_role });
        }
    })
}));

//리스트에서 진료접수로 넘어왔을 경우 메인 페이지
router.get('/:patient_id', isAuthenticated, catchErrors(async (req, res, next) => {
    if (res.locals.currentUser.user_role != 1) res.redirect('/');
    var patient_id = req.params.patient_id;
    var date = getDate();
    let docRow;
    let patRow;
    var doctorSql = "SELECT * FROM medic.employee where employee_id=" + res.locals.currentUser.user_information;
    var patientSql = "SELECT * FROM medic.patient where patient_id=" + patient_id;
    query(doctorSql)
        .then(rows => { docRow = rows; return query(patientSql); }, err => { console.log('Error while performing Query.', err); })
        .then(rows => { patRow = rows; }, err => { console.log('Error while performing Query.', err); })
        .then(() => {
            var doc = {
                dept_id: docRow[0].department_id - 1,
                name: docRow[0].name,
                department: getDeptName(docRow[0].department_id)
            }
            var selectPatient = {
                name: patRow[0].name,
                patient_id: patient_id
            }
            res.render('receipt/receiptmain', { selectPatient: selectPatient, doc: doc, date: date, role: res.locals.currentUser.user_role });
        })
        .catch(err => {
            console.log(err);
        })
}));

//진료기록 작성 완료
router.post('/', catchErrors(async (req, res, next) => {
    var doctor_id = res.locals.currentUser.user_information;
    var patient_id = req.body.patient_id;
    var date = req.body.date;
    var disease = req.body.disease;
    var description = req.body.description;
    var precaution = req.body.precaution;
    var doctorSql = "SELECT department_id FROM medic.employee where employee_id=" + res.locals.currentUser.user_information;
    var insertSql = "INSERT INTO medical_record (patient_id, doctor_id, date, disease, description, precaution) VALUES('" + patient_id + "','" + doctor_id + "','" + date + "','" + disease + "','" + description + "','" + precaution + "')";
    checkValidate(req.body)
        .then(query(insertSql))
        .then(rows => {
            console.log(rows);
        })
        .then(() => {
            //url 환자 번호로 dequeue요청
            query(doctorSql)
                .then(rows => {
                    dept_id = rows[0].department_id;
                    dept_id -= 1;
                    console.log(dept_id);
                    var url = dept_id + '/dequeue/' + patient_id;
                    res.redirect('/receipt/' + url + '/re');
                })
                .catch()
        })
        .catch(err => {
            console.log(err);
            var errlog = validateFormReceipt(req.body);
            req.flash('danger', "안채운 항목이 있습니다." + errlog);
            res.redirect('back')
        })
}));

module.exports = router;
