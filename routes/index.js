var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var sendinBlue = require('nodemailer-sendinblue-transport');
var config = require('../config');
var axios = require('axios')

var mailTemplate = require('../utility/sendMail')
let transporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
          user: "domankey@gmail.com",
          pass: "G0SNX4bsahcPAYEO",
        },
   });

/* GET home page. */

const getId= (url) => {
  return url.split('/')[url.split('/').length-1]
}

const parseMainInfo = () => {
  return axios.get(`https://kr.object.ncloudstorage.com/manmanman/info.txt`)
    .then(res => {
      let result = {}
      let text = res.data;
      text.split('\n').forEach((element, index) => {
        let parsed = element.split('--')
        // console.log(parsed[2])
        parsed[2] = `https://www.youtube.com/embed/${getId(parsed[2])}`
        result[index] = parsed
      });

      return result
    })
    .catch(err => {
      return {
        artist: 'Error Loading',
        song: '...',
      }
    })
}

const parseInfo = (num) => {
  return axios.get(`https://kr.object.ncloudstorage.com/studio/${num}/info.txt`)
    .then(res => {
      let result = {}
      let text = res.data;
      text.split('\n').forEach(element => {
        let parsed = element.split(':')
        result[parsed[0]] = parsed[1]
      });

      return result
    })
    .catch(err => {
      return {
        artist: 'Error Loading',
        song: '...',
      }
    })
}

router.use((req, res, next) => {
  if (req.acceptsLanguages('ko-KR', 'ko', 'kr'))
    req.lang = 'kr'
  else
    req.lang = 'en'
  next()
})

router.get('/', function (req, res, next) {
  res.redirect(`/${req.lang}`)
});

router.get('/kr', function (req, res, next) {

  new Promise((resolve, reject) => {
    var result =  parseMainInfo();
    resolve(result);
  }).then(result =>{

    res.render('index_kr',{
      data: result
    });
  })

});

router.get('/en', function (req, res, next) {
  new Promise((resolve, reject) => {
    var result =  parseMainInfo();
    resolve(result);
  }).then(result =>{

    res.render('index_en',{
      data: result
    });
  })

});

/* GET contact page. */
router.get('/contact', function (req, res, next) {
  res.redirect(`/contact/${req.lang}`)
});

router.get('/contact/kr', function (req, res, next) {
  res.render('contact_kr');
});

router.get('/contact/en', function (req, res, next) {
  res.render('contact_en')
});

router.post('/contact/:lang', function (req, res, next) {
  let region = "한국어"
  if (req.params.lang == 'en') {
    region = "영어"
  }

  let email = {
    from: `"스튜디오 웹페이지" <${config.email}>`,
    to: config.email,
    subject: `스튜디오 ${region} 웹페이지로부터 온 알림입니다.`,
    html: mailTemplate({
      title: req.body.title,
      name: req.body.name,
      email: req.body.email,
      message: req.body.body.split('\n').join('\n<br>\n'),
    }),
  };
  transporter.sendMail(email, function (err, info) {
    if (err) {
      res.redirect(`/contact/result/${req.params.lang}?result=fail`)
    }
    else
      res.redirect(`/contact/result/${req.params.lang}?result=success`)
  });
})

router.get('/contact/result', function (req, res, next) {
  res.redirect(`/contact/result/${req.lang}`)
});

router.get('/contact/result/kr', function (req, res, next) {
  let title;
  let message;
  if (req.query.result == 'success') {
    title = "메세지 보내기가 성공하였습니다."
    message = "이제 당신의 여행이 시작됩니다."
  }
  else {
    title = "메세지 보내기가 실패하였습니다."
    message = "조금 후에 다시 시도해주세요."
  }

  res.render(`result_kr`, {
    title: title,
    message: message
  })
})


router.get('/contact/result/en', function (req, res, next) {
  let title;
  let message;
  if (req.query.result == 'success') {
    title = "Successful."
    message = "Thank you. We Will Respond Shortly"
  }
  else {
    title = "Try Again"
    message = "Please Try Again."
  }

  res.render(`result_en`, {
    title: title,
    message: message
  })
})

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
