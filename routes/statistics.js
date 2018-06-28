var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: '58.123.136.107',
    port: '3308',
    user: 'web',
    password: 'mju12345',
    database: 'medic'
});

conn.connect();
const catchErrors = require('../lib/async-error');

router.get('/', catchErrors(async(req, res, next) => {
    var hospital_rooms = [];
    conn.query('SELECT * FROM hospital_room',function(err,rows,fields){
        var hospital_room;
        if(!err){
            for(var i = 0; i < rows.length; i++){
                var hospital_room = {
                    'room_no' : rows[i].room_no + '번 방' ,
                    'temperature' : rows[i].temperature,
                    'humidity' : rows[i].humidity
                
                }
                hospital_rooms.push(hospital_room);
            }
            console.log(hospital_rooms);
        }
        else{
            console.log(err);
        }
        res.render('statistics/statistics', {rooms:hospital_rooms});
    });
}));

router.get('/temperatureGraph', catchErrors(async(req, res, next) => {
    var historis = [];
    conn.query('SELECT * FROM temperature_history',function(err,rows,fields){
        var history;
        if(!err){
            for(var i=0; i<rows[i].length ; i++)
                var history ={
                    'temperature' : rows[i].temperature,
                    'time': rows[i].teme,
                    'hospital_room':hospital_room
                } 
                historis.push(history);
        }
        else{
            console.log(err);
        }
        res.render('statistics/temperatureGraph',{historis:historis});
    });
}));

module.exports = router;