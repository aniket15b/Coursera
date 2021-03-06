var express    = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var multer  = require('multer');
var cors = require('cors');
var mmm = require('mmmagic');
var Magic = mmm.Magic;
var fs = require('fs');

var regController = require('./controller/register');
var loginController = require('./controller/login');
var logoutController = require('./controller/logout');
var userController = require('./controller/user');
var coursesController = require('./controller/courses');
var subscriptionController = require('./controller/subscription');
var approvalController = require('./controller/approvals');

var conn = require('./config/config');

var app = express();

var store = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/images');
  },
  filename: function (req, file, cb) {
    cb(null, 'avatar' + '-' + req.session.email.split('.')[0] + req.session.email.split('.')[1]);
  }
});

var ul = multer({
  storage: store,
  fileFilter: function (req, file, callback) {
    var path = require('path');
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        req.err = 'FileTypeError';
        return callback(null, false, new Error('Only images are allowed'));
    }
    callback(null, true)
  },

  limits: { fileSize: 1000000 }
}).single('avatar');

//middleware to check login
var sessionChecker = (req, res, next) => {
    if (req.session.cookie && req.session.loggedin) {
        next();
    } else {
        res.json({
					status: false,
          message: "User not logged in",
				});
    }
};

app.use(cors({origin: [
  "http://localhost:8100"
], credentials: true}));

app.use(session({
  name: 'user_sid',
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
  cookie: {
    path: '/',
    secure:false,
    expires: false
  }
}));

app.use(cookieParser());

app.use(session({
  name: 'user_sid',
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
  cookie: {
    path: '/',
    secure:false,
    expires: false
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var api = express.Router();

// test route
api.get('/', sessionChecker, function(req, res) {

  res.json({
    status: true,
    message: "Welcome",
    userlevel: req.session.userlevel
  });

});

//route to handle avatars
app.get('/images/:imgname', (req, res) => {
  var name = req.params.imgname;
  var imagepath = __dirname + "/images/avatar-" + name;
  res.sendFile(imagepath);
});
//route to handle user registration
api.post('/register', regController.register);
//route to handle user login
api.post('/login', loginController.login);
//route to handle user logout
api.get('/logout', logoutController.logout);
//route to handle user data
api.put('/user', sessionChecker, ul, userController.user);
api.get('/user',sessionChecker, userController.userinfo);
api.get('/user/:email',sessionChecker, userController.userinfobyemail);
//route to handle subscriptions
api.get('/subscription', sessionChecker, subscriptionController.subscription);
api.post('/subscription/:id', subscriptionController.addsub);
api.delete('/subscription/:id', sessionChecker, subscriptionController.removesub);
api.get('/subscription/:id', sessionChecker, subscriptionController.getsubbyid);
//route to handle explore courses
api.post('/courses', sessionChecker, coursesController.addcourses);
api.get('/courses/:id', sessionChecker, coursesController.getcoursesbyid);
api.put('/courses/:id', sessionChecker, coursesController.updatecourse);
api.delete('/courses/:id', sessionChecker, coursesController.deletecourse);
api.get('/courses', sessionChecker, coursesController.getcourses);
//route to handle admin requests
api.post('/approvals', sessionChecker, approvalController.addcourse);
api.delete('/approvals/:id',sessionChecker, approvalController.deletecourse);
api.get('/approvals',sessionChecker, approvalController.getapproval);

app.use('/api', api);
app.listen(5000);
