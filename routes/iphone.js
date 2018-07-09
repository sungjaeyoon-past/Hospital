var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
const catchErrors = require('../lib/async-error');

router.post('/login', catchErrors(async (req, res, next) => {
    var user_id = req.body.user_id;
    var password = req.body.password;
    var Sql = "select * from medic.iphone_user where user_id ='" + user_id + "'";
    await connection.query(Sql, function (err, result) {
        if (err) {
            console.log('err :' + err);
        } else {
            if (result.length === 0) {
                res.json({ success: false, msg: '해당 유저가 존재하지 않습니다.' })
            } else {
                console.log(result[0].user_password);
                console.log(password);
                if (password != result[0].user_password) {
                    res.json({ success: false, msg: '비밀번호가 일치하지 않습니다.' })
                } else {
                    res.json({ success: true, msg: '로그인 성공 하였습니다.', patient_id: result[0].patient_id })
                }
            }
        }
    });
}));

router.post('attention', catchErrors(async (req, res, next) => {
    var patient_id = req.body.patient_id;
    await connection.query('select precaution from medic.medical_record where patient_id = ?', patient_id, function (err, result) {
        if (err) {
            console.log('err :' + err);
        } else {
            res.json({ result: result });
        }
    });
}));
module.exports = router;