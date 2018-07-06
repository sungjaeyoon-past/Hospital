var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const catchErrors = require('../lib/async-error');
var conn = mysql.createConnection({
    host: '58.123.136.107',
    port: '3308',
    user: 'web',
    password: 'mju12345',
    database: 'medic'
  });
  conn.connect();

function getSqlResult(insertSql, callback){
    conn.query(insertSql,function(err,result){
        if(err)
        callback(err,null);
        else
        callback(null,result);
    });
}

//진료 접수 메인 페이지
router.get('/', catchErrors(async (req, res, next) => {
    var medicineList=[];
    var insertSql='SELECT * FROM medicine';
    getSqlResult(insertSql, function(err,data){
        if (err) {
          console.log("ERROR : ",err);            
        } else {          
            for(var i in data){
                var medicine={
                    'medicine_id':data[i].medicine_id,
                    'name':data[i].name,
                    'description':data[i].description,
                    'warning':data[i].warning
                }
            }
            medicineList.push(medicine);
            res.render('receipt/receiptmain', {medicineList:medicineList});
        }
    });
}));

//리스트에서 진료접수로 넘어왔을 경우 메인 페이지
router.get('/:id', catchErrors(async (req, res, next) => {
    var medicineList=[];
    var insertSql='SELECT * FROM medicine';
    getSqlResult(insertSql, function(err,data){
        if (err) {
          console.log("ERROR : ",err);            
        } else {          
            for(var i in data){
                var medicine={
                    'medicine_id':data[i].medicine_id,
                    'name':data[i].name,
                    'description':data[i].description,
                    'warning':data[i].warning
                }
            }
            medicineList.push(medicine);
            res.render('receipt/receiptmain', {patient_id:req.params.id, medicineList:medicineList});
        }
    });
}));

//진료기록 작성 완료
router.post('/', catchErrors(async (req, res, next) => {
    var patient_id=req.body.patient_id;
    var doctor_id=req.body.doctor_id;
    var date=req.body.date;
    var disease=req.body.disease;
    var description=req.body.description;
    var medicine_id=req.body.medicine_id;
    var amount=req.body.amount;
    var frequency=req.body.frequency;
    var precaution=req.body.precaution;
    var insertSql="INSERT INTO medical_record (patient_id, doctor_id, date, disease, description, medicine_id, amount, frequency, precaution ) VALUES('"+patient_id+"','"+doctor_id+"','"+date+"','"+disease+"','"+description+"','"+medicine_id+"','"+amount+"','"+frequency+"','"+precaution+"')";  
    getSqlResult(insertSql,function(err,date){
        if(err){
          console.log("ERROR : ",err);
          req.flash('success', "추가 실패");
        }else{
            req.flash('success', "추가 성공");
        }
        res.redirect('receipt/receiptmain');
      });
}));

module.exports = router;
