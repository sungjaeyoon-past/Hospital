

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
    var rooms_info = [];
    conn.query('SELECT * FROM hospital_room',function(err,rows,fields){
        var room_info;
        if(!err){
            var room_info = {
                'room1_temperature' : rows[0].temperature,
                'room1_humidity' : rows[0].humidity,
            
                'room2_temperature' : rows[1].temperature,
                'room2_humidity' : rows[1].humidity,
                
                'room3_temperature' : rows[2].temperature,
                'room3_humidity' : rows[2].humidity,
                
                'room4_temperature' : rows[3].temperature,
                'room4_humidity' : rows[3].humidity
            }
            rooms_info.push(room_info);
        }
        else{
            console.log(err);
        }
    });
    conn.query('SELECT * FROM statistics',function(err,rows,fields){
        var info;
        if(!err){
            for(var i = 0; i < rows.length; i++){
                var info = {
                    'name' :rows[i].name ,
                    'hospital_room' :rows[i].hospital_room,
                    'bed_no' :rows[i].bed_no,
                    'temperature':rows[i].temperature,
                    'humidity':rows[i].humidity,
                    'weight_sensor':rows[i].weight_sensor,
                    'is_wet':rows[i].is_wet,
                    'is_empty':rows[i].is_empty,
                    
                }
                rooms_info.push(info);
            }
            console.log(rooms_info);
        }
        else{
            console.log(err);
        }
        res.render('statistics/statistics', {infos:rooms_info});
    });
}));

router.get('/temperatureGraph', catchErrors(async(req, res, next) => {
    var historis = [];
    conn.query('SELECT * FROM temperature_history',function(err,rows,fields){
        var history;
        if(!err){
            for(var i=0; i<rows.length ; i++){
                var history ={
                    'temperature' : rows[i].temperature,
                    'time': rows[i].time,
                    'hospital_room':rows[i].hospital_room
                } 
                historis.push(history);
            }
            console.log(historis);
        }
        else{
            console.log(err);
        }
        res.render('statistics/temperatureGraph',{histor:historis});
    });
}));

module.exports = router;