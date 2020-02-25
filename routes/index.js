var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact');
});

// /* GET login page. */
// router.get('/login', function(req, res, next) {
//   res.render('login');
// });

// let usr = {
//   email: 'aa@aa.com',
//   password: '1111'
// }

// router.post('/login', function(req, res, next) {
//   if(req.body.email === usr.email && req.body.password == usr.password){
//     req.session.user = true;
//     res.redirect('/boss');
//   } else {
//     res.redirect('/login?error=login');
//   }
// });



// /* GET boss page. */
// router.get('/boss', function(req, res, next) {
//   console.log(req.session.user)
//   res.render('boss');
// });


module.exports = router;
