var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();

router.post('/login', function (req, res, next) {
    var user_id = req.body.user_id;
    var password = req.body.password;
    connection.query('select * from medic.iphone_user where user_id = ?', user_id, function (err, result) {
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
                    res.json({ success: true, msg: '로그인 성공 하였습니다.' , user_fk:result[0].user_fk })
                }
            }
        }
    });
});

router.post('attention', function (req, res, next) {
    var user_fk = req.body.user_fk;
    connection.query('select * from medic.patient where user_fk = ?', user_fk, function (err, result) {
        if (err) {
            console.log('err :' + err);
        } else {
            res.json({result:result});
        }
    });
 });
module.exports = router;