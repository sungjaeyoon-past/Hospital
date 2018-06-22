var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname + "/main.html");
});

router.post('/email_post',function(req,res){
  res.send("welcome "+req.body.email);
  console.log(req.body.email);
})

module.exports = router;
