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
    var end_datetime = form.end_datetime || "";
    var operating_room_id = form.operating_room_id || "";
    var description = form.description || "";

    if(!patient_id) { return "환자 id 미입력"; }
    if(!doctor_id) { return "의사 id 미입력"; }
    if(!reserved_datetime) { return "수술 예정일 미입력"; }
    if(!end_datetime) { return "수술 완료 예정일 미입력"; }
    if(!operating_room_id) { return "수술실 미입력"; }
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
    var oproomList = [0, 0, 0, 0];
    
//예약 현황 받아오기
    var surgeryList=[];
    var insertSql='SELECT * FROM surgery_schedule_view';
    var insertSqlop = 'SELECT * FROM operating_room';

    getSql(insertSqlop, function(err, data){
        if(err){
            console.log("error", err);
        } else {
            for (var i in data){
                if(data[i].operating_room_id != null){
                    oproomList[parseInt(data[i].operating_room_id) % 4 ] = 1;
                }
            }
            getSql(insertSql, function(err, data){
                if(err){
                    console.log("error", err);
                } else {
                    for(var i in data){
                        var surgery = {
                            'surgery_schedule_id': data[i].surgery_schedule_id,
                            'patient_name': data[i].patient_name,
                            'doctor_name': data[i].doctor_name,
                            'reserved_datetime': data[i].reserved_datetime,
                            'end_datetime': data[i].end_datetime,
                            'description': data[i].description,
                            'patient_id': data[i].patient_id
                        }

                        surgeryList.push(surgery);
                    }
                }
                res.render('surgery/surgerymain', {role: res.locals.currentUser.user_role, oproomList: oproomList, surgeryList: surgeryList});
            });
        }
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
    var end_datetime = req.body.end_datetime;
    var operating_room_id = req.body.operating_room_id;
    var description = req.body.description;

    var insertSql = "INSERT INTO surgery_schedule (patient_id, doctor_id, reserved_datetime, end_datetime, description) VALUES ('" +patient_id+" ', ' "+doctor_id+" ', '"+reserved_datetime+"','"+end_datetime+"','"+description+"')";
    var insertSqlop = "INSERT INTO operating_room (operating_room) VALUES ('"+operating_room_id+"')";
    console.log(insertSql);
    getSql(insertSql, function(err,data){
      if (err) {
          console.log("error",err);
          req.flash('danger', "오류가 발생했습니다.");            
      } else {
          getSql(insertSql, function(err, data){
              if(!err){
                req.flash('success', "수술실 예약이 추가되었습니다.");
              }
          })
      }
    });
    getSql(insertSqlop, function(err,data){
        if(!err){
            req.flash('success', "수술실 예약이 추가되었습니다.");
        }
    })
    res.redirect('/surgery');
  }));


module.exports = router;