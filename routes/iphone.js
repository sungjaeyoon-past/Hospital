var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
const catchErrors = require('../lib/async-error');

function query(sql, args) {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
}

router.post('/', catchErrors(async (req, res, next) => {
    res.json({ success: true, msg: 'con이 제대로 작동중입니다.' });
}));

router.post('/signup', catchErrors(async (req, res, next) => {
    var user_id = req.body.user_id;
    var password = req.body.password;
    var phone_number = req.body.phone_number;
    console.log(user_id + " " + password + " " + phone_number);
    var getSql = "select patient_id from patient where phone_number=" + phone_number;
    var insertSql;
    query(getSql)
        .catch(() => {
            console.log("getSql is rejected");
        })
        .then(rows => {
            patient_id = rows[0].patient_id;
            insertSql = "insert into iphone_user(user_id,password,patient_id) values('" + user_id + "','" + password + "'," + patient_id + ")";
            return query(insertSql);
        })
        .catch(() => {
            res.json({ msg: "failed" });
        })
        .then(() => {
            res.json({ msg: "success" });
        })

}));

router.post('/login', catchErrors(async (req, res, next) => {
    var user_id = req.body.user_id;
    var password = req.body.password;
    console.log(user_id);
    console.log(password);
    var Sql = "select * from medic.iphone_user where user_id ='" + user_id + "'";
    await connection.query(Sql, function (err, result) {
        if (err) {
            console.log('err :' + err);
        } else {
            if (result.length === 0) {
                res.json({ success: false, msg: '해당 유저가 존재하지 않습니다.' });
            } else {
                if (password != result[0].password) {
                    res.json({ success: false, msg: '비밀번호가 일치하지 않습니다.' });
                } else {
                    res.json({ success: true, msg: '로그인 성공 하였습니다.', patient_id: result[0].patient_id });
                }
            }
        }
    });
}));

router.post('/login', catchErrors(async (req, res, next) => {
    var user_id = req.body.user_id;
    var password = req.body.password;
    console.log(user_id);
    console.log(password);
    var Sql = "select * from medic.iphone_user where user_id ='" + user_id + "'";
    await connection.query(Sql, function (err, result) {
        if (err) {
            console.log('err :' + err);
        } else {
            if (result.length === 0) {
                res.json({ success: false, msg: '해당 유저가 존재하지 않습니다.' });
            } else {
                if (password != result[0].password) {
                    res.json({ success: false, msg: '비밀번호가 일치하지 않습니다.' });
                } else {
                    res.json({ success: true, msg: '로그인 성공 하였습니다.', patient_id: result[0].patient_id });
                }
            }
        }
    });
}));

router.post('/aboutme', catchErrors(async (req, res, next) => {
    var patient_id = req.body.patient_id;
    console.log(patient_id);
    var Sql = "select * from medic.patient where patient_id = " + patient_id;
    await connection.query(Sql, function (err, result) {
        if (err) {
            console.log('err :' + err);
        } else {
            res.json({ result: result });
        }
    });
}));

router.post('/attention', catchErrors(async (req, res, next) => {
    var patient_id = req.body.patient_id;
    console.log(patient_id);
    var Sql = "select disease,date,precaution from medic.medical_record where patient_id = " + patient_id;
    await connection.query(Sql, function (err, result) {
        if (err) {
            console.log('err :' + err);
        } else {
            res.json({ result: result });
        }
    });
}));
module.exports = router;