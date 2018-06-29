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

/* GET home page. */
router.get('/', catchErrors(async (req, res, next) => {
    res.render('receipt/receiptmain');
}));

module.exports = router;
