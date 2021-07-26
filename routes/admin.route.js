const router = require('express').Router();
const AdminCtrl = require('../controllers/admin.controller');

router.route('/login').get(AdminCtrl.LoginView).post(AdminCtrl.Login);
router.get('/', (req, res) => res.redirect('dashboard'));
router.get('/dashboard', AdminCtrl.Dashboard);
router.get(
  '/application/status/:id/:status',
  AdminCtrl.UpdateApplicationStatus
);
router.get('/application/:id', AdminCtrl.ApplicationView);
router.get('/logout', AdminCtrl.Logout);
module.exports = router;
