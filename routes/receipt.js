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

function validateFormReceipt(form, option) {
    var patient_id = form.patient_id || "";
    var doctor_id = form.doctor_id || "";
    var date = form.date || "";
    var disease = form.disease || "";
    var description = form.description || "";
    var medicine_id = form.medicine_id || "";
    var amount = form.amount || "";
    var frequency = form.frequency || "";
    var precaution = form.precaution || "";

    if(!patient_id){return "환자 번호를 입력해주세요!";}
    if(!doctor_id){return "담당의사 번호를 입력해주세요!";}
    if(!date){return "날짜를 입력해주세요!";}
    if(!disease){return "질병 이름을 입력해주세요!";}
    if(!description){return "진료 내용를 입력해주세요!";}
    if(!medicine_id){return "약 번호를 입력해주세요!";}
    if(!amount){return "약의 양를 입력해주세요!";}
    if(!frequency){return "약 복용횟수를 입력해주세요!";}
    if((patient_id<0)||(doctor_id<0)||(medicine_id<0)||(amount<0)||(frequency<0)){return "0이상의 수를를 입력해주세요!";}
    if(!precaution){return "주의사항을 입력해주세요!";}
  }

//진료기록 작성 완료
router.post('/', catchErrors(async (req, res, next) => {
    const err = validateFormReceipt(req.body);
    if (err) {
      req.flash('danger', err);
      console.log(err);
      return res.redirect('back');
    }
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
        if(!err){
            req.flash('success', "추가 성공");
        }
        res.redirect('receipt/receiptmain');
      });
}));

module.exports = router;
