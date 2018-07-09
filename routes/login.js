var express = require('express');
var router = express.Router();
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();


/**
 * */

/*로그인 성공시 사용자 정보를 Session에 저장한다*/
passport.serializeUser(function (user, done) {
    done(null, user)
});

/*인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.*/
passport.deserializeUser(function (user, done) {
    done(null, user);
});

/*로그인 유저 판단 로직*/
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};


passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true, //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
    Session: true
}, function (req, username, password, done) {
    connection.query('select * from medic.user where user_id = ?', username, function (err, result) {
        if (err) {
            console.log('err :' + err);
            return done(false, null);
        } else {
            if (result.length === 0) {
                console.log('해당 유저가 없습니다');
                return done(false, null);
            } else {
                if (password != result[0].user_password) {
                    console.log('패스워드가 일치하지 않습니다');
                    return done(false, null);
                } else {
                    console.log('로그인 성공');
                    return done(null, {
                        user_id: result[0].user_id,
                        user_role: result[0].role,
                        user_information: result[0].employee_id
                    });
                }
            }
        }
    })
}));

router.get('/', function (req, res) {

    console.log(req.user);

    if (req.user !== undefined) {
        res.redirect('/')
    } else {
        res.render('login/login');
    }

});


router.post('/', passport.authenticate('local', { failureRedirect: '/login', failureFlash: false }), // 인증실패시 401 리턴, {} -> 인증 스트레티지
    function (req, res) {
        res.redirect('/');
    });

/*Log out*/
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;