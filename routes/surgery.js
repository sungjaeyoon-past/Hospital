var express = require('express');
var router = express.Router();

const catchErrors = require('../lib/async-error');
const isAuthenticated = require('../lib/isAuthenticated');
var mysql_dbc = require('../db/db_con')();
var conn = mysql_dbc.init();

function validateForm(form, option){

    var patient_id = form.patient_id || "";
    var doctor_id = form.doctor_id || "";
    var reserved_datetime = form.reserved_datetime || "";
    var description = form.description || "";


    if(!patient_id) { return "환자 id 미입력"; }
    if(!doctor_id) { return "의사 id 미입력"; }
    if(!reserved_datetime) { return "수술 예정일 미입력"; }
    if(!description) { return "비고 미입력"; }
}

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
            for(var i in data){
                var surgery = {
                    'patient_id': data[i].patient_id,
                    'doctor_id': data[i].doctor_id,
                    'reserved_datetime': data[i].reserved_datetime,
                    'description': data[i].description
                }
                surgeryList.push(surgery);
            }
        }
        res.render('surgery/surgerymain', {role: res.locals.currentUser.user_role ,surgeryList: surgeryList});
    })    
}));

//예약 추가
router.get('/new', catchErrors(async (req, res, next) => {
    res.render('surgery/new');
  }));
  
router.post('/new', catchErrors(async (req, res, next) => {
    const err = validateForm(req.body);
    if (err) {
      req.flash('danger', err);
      console.log(err);
      return res.redirect('back');
    }

    var patient_id = req.body.patient_id;
    var doctor_id = req.body.doctor_id;
    var reserved_datetime = req.body.reserved_datetime;
    var description = req.body.description;

    var insertSql = "INSERT INTO surgery_schedule (patient_id, doctor_id, reserved_datetime, description) VALUES ('" +patient_id+" ', ' "+doctor_id+" ', '"+reserved_datetime+"','"+description+"')";
    console.log(insertSql);
    getSql(insertSql, function(err,data){
      if (err) {
          console.log("error",err);
          req.flash('danger', "오류가 발생했습니다.");            
      } else {
        req.flash('success', "수술실 예약이 추가되었습니다.");
      }
    });
    res.redirect('/surgery');
  }));


module.exports = router;