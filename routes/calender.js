var express = require('express');
var router = express.Router();
const catchErrors = require('../lib/async-error');

router.get('/', function (req, res, next) {
    //!db에서 일정받아서 랜더링

    res.render('calenders/index');
});

//!일정추가
router.post('/',function(){
});

//!일정변경
router.put('/',function(){

});

//!일정삭제
router.delete('/',function(){

});



module.exports = router;