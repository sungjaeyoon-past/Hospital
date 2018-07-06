

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var mysql_dbc = require('../db/db_con')();
var conn = mysql_dbc.init();//디비 모듈 export

const catchErrors = require('../lib/async-error');
const isAuthenticated = require('../lib/isAuthenticated');//로그인 됬는지 확인하는 펑션

//그리기 전에 먼저 로그인 되있는지 확인함 - 확인하고 주석 지워주셈
//catchErrors앞에 isAuthenticated를 쓰면 먼저 로그인 확인하고 나머지 실행함
//role은 역할이며 0 최고관리자 1 의사 2간호사 navbar를 위해 role까지 전달
//유저정보 얻는법 res.locals.currentUser하면 됨 지금은 유저아이디 역할밖에 없는데 필요한거 잇음 말좀
router.get('/', isAuthenticated, catchErrors(async (req, res, next) => {
    var rooms_info = [];
    conn.query('SELECT * FROM hospital_room', function (err, rows, fields) {
        var room_info;
        if (!err) {
            var room_info = {
                'room1_temperature': rows[0].temperature,
                'room1_humidity': rows[0].humidity,

                'room2_temperature': rows[1].temperature,
                'room2_humidity': rows[1].humidity,

                'room3_temperature': rows[2].temperature,
                'room3_humidity': rows[2].humidity,

                'room4_temperature': rows[3].temperature,
                'room4_humidity': rows[3].humidity
            }
            rooms_info.push(room_info);
        }
        else {
            console.log(err);
        }
    });
    conn.query('SELECT * FROM statistics', function (err, rows, fields) {
        var info;
        if (!err) {
            for (var i = 0; i < rows.length; i++) {
                var info = {
                    'patient_id': rows[i].patient_id,
                    'name': rows[i].name,
                    'hospital_room': rows[i].hospital_room,
                    'bed_no': rows[i].bed_no,
                    'temperature': rows[i].temperature,
                    'humidity': rows[i].humidity,
                    'weight_sensor': rows[i].weight_sensor,
                    'is_wet': rows[i].is_wet,
                    'is_empty': rows[i].is_empty,

                }
                rooms_info.push(info);
            }
            console.log(rooms_info);
        }
        else {
            console.log(err);
        }
        res.render('statistics/statistics', { role: res.locals.currentUser.user_role, infos: rooms_info });
    });
}));

router.get('/temperatureGraph', isAuthenticated, catchErrors(async (req, res, next) => {
    var historis = [];
    conn.query('SELECT * FROM temperature_history', function (err, rows, fields) {
        var history;
        if (!err) {
            for (var i = 0; i < rows.length; i++) {
                var history = {
                    'temperature': rows[i].temperature,
                    'time': rows[i].time,
                    'hospital_room': rows[i].hospital_room
                }
                historis.push(history);
            }
            console.log(historis);
        }
        else {
            console.log(err);
        }
        res.render('statistics/temperatureGraph', { role: res.locals.currentUser.user_role, histor: historis });
    });
}));

module.exports = router;