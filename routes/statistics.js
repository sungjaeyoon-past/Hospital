

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
    var department_infos =[];
    var rooms_info = [];
    conn.query('SELECT AVG(temperature) as temperature,AVG(humidity) as humidity FROM hospital_room where room_no <5', function (err, rows, fields) {
        var department_info;
        if (!err) {
            var department_info = {
                'department_name': '안과',
                'eng':'Ophthalmology',
                'temperature': rows[0].temperature,
                'humidity':rows[0].humidity
            }

            department_infos.push(department_info);
        }
        else {
            console.log(err);
        }
    });
    
    conn.query('SELECT AVG(temperature) as temperature,AVG(humidity) as humidity FROM hospital_room where room_no >4 and room_no<9', function (err, rows, fields) {
        var department_info;
        if (!err) {
            var department_info = {
                'department_name': '내과',
                'eng':'Medicine',
                'temperature': rows[0].temperature,
                'humidity':rows[0].humidity
            }

            department_infos.push(department_info);
        }
        else {
            console.log(err);
        }
    });
    
    conn.query('SELECT AVG(temperature) as temperature,AVG(humidity) as humidity FROM hospital_room where room_no <13 and room_no>8', function (err, rows, fields) {
        var department_info;
        if (!err) {
            var department_info = {
                'department_name': '외과',
                'eng':'Surgery',
                'temperature': rows[0].temperature,
                'humidity':rows[0].humidity
            }
            department_infos.push(department_info);
        }
        else {
            console.log(err);
        }
    });
    
    conn.query('SELECT AVG(temperature) as temperature,AVG(humidity) as humidity FROM hospital_room where room_no >12', function (err, rows, fields) {
        var department_info;
        if (!err) {
            var department_info = {
                'department_name': '치과',
                'eng':'Dentist',
                'temperature': rows[0].temperature,
                'humidity':rows[0].humidity
            }
            department_infos.push(department_info);
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
        }
        else {
            console.log(err);
        }
        res.render('statistics/statistics', { role: res.locals.currentUser.user_role, infos: rooms_info, d_infos:department_infos });
    });
}));

router.get('/temperatureGraphOphthalmology', isAuthenticated, catchErrors(async (req, res, next) => {
    var historis = [];
    conn.query('SELECT * FROM temperature_history where hospital_room<5', function (err, rows, fields) {
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
        }
        else {
            console.log(err);
        }
        res.render('statistics/temperatureGraphOphthalmology', { role: res.locals.currentUser.user_role, histor: historis });
    });
}));
router.get('/temperatureGraphMedicine', isAuthenticated, catchErrors(async (req, res, next) => {
    var historis = [];
    conn.query('SELECT * FROM temperature_history where 5<=hospital_room and hospital_room<9', function (err, rows, fields) {
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
        }
        else {
            console.log(err);
        }
        res.render('statistics/temperatureGraphMedicine', { role: res.locals.currentUser.user_role, histor: historis });
    });
}));
router.get('/temperatureGraphDentist', isAuthenticated, catchErrors(async (req, res, next) => {
    var historis = [];
    conn.query('SELECT * FROM temperature_history where 9<=hospital_room and hospital_room<13', function (err, rows, fields) {
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
        }
        else {
            console.log(err);
        }
        res.render('statistics/temperatureGraphDentist', { role: res.locals.currentUser.user_role, histor: historis });
    });
}));
router.get('/temperatureGraphSurgery', isAuthenticated, catchErrors(async (req, res, next) => {
    var historis = [];
    conn.query('SELECT * FROM temperature_history where 12<hospital_room', function (err, rows, fields) {
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
        }
        else {
            console.log(err);
        }
        res.render('statistics/temperatureGraphSurgery', { role: res.locals.currentUser.user_role, histor: historis });
    });
}));

module.exports = router;