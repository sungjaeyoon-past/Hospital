var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');
const isAuthenticated = require('../lib/isAuthenticated');
var mysql_dbc = require('../db/db_con')();
var conn = mysql_dbc.init();

function getSql(insertSql, callback){
    conn.query(insertSql,function(err,result){
        if(err)
        callback(err,null);
        else
        callback(null,result);
    });
}

router.get('/', isAuthenticated, catchErrors(async (req, res, next) => {
    var surgeryList=[];
    var insertSql='SELECT * FROM surgery_schedule';
    getSql(insertSql, function(err, data){
        if(err){
            console.log("error", err);
        } else {
            for(var i in rows){
                var surgery={
                    'surgery_schedule_id': rows[i].surgery_schedule_id,
                    'patient_id': rows[i].patient_id,
                    'doctor_id': rows[i].doctor_id,
                    'reserved_datetime': rows[i].reserved_datetime,
                    'description': rows[i].description
                }
            }
            surgeryList.push(surgery);
            res.render('surgery/surgerymain', {surgeryList: surgeryList});
        }
    })    
}));


  module.exports = router;