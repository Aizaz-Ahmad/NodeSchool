const router = require('express').Router();
const StudentCtrl = require('../controllers/student.controller');

router.get('/', StudentCtrl.Index);
router.get('/signup', StudentCtrl.SignupView);
router.post('/signup', StudentCtrl.Signup);
router.get('/login', StudentCtrl.LoginView);
router.post('/login', StudentCtrl.Login);
router.get('/logout', StudentCtrl.Logout);
router.post('/', StudentCtrl.ApplicationSubmit);
module.exports = router;
