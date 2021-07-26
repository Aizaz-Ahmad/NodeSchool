const AdminDAO = require('../models/admin.dao');
const ApplicationDAO = require('../models/application.dao');
const StudentDAO = require('../models/student.dao');
const hashPwd = require('../password-hashing');
class AdminController {
  static LoginView(req, res, next) {
    if (req.session.user_id) return res.redirect('/admin/');
    res.status(200).render('admin/login', { title: 'Login - Admin' });
  }
  static Logout(req, res, next) {
    req.session.destroy();
    res.redirect(`/admin/login`);
  }

  static async Login(req, res, next) {
    const errorObj = {
      error: true,
      title: 'Login - Admin',
      message: '',
    };
    const { email, password } = req.body;
    if (!email || !password) {
      errorObj.message = 'Must Fill out all fields';
      return res.status(400).render('admin/login', errorObj);
    }
    try {
      let admin = await AdminDAO.getAdminWithEmail(email);
      if (!admin) errorObj.message = 'Admin With this Email Does Not Exist';
      else if (!(await hashPwd.comparePassword(password, admin.password)))
        errorObj.message = 'Incorrect Password';
      if (errorObj.message)
        return res.status(400).render('admin/login', errorObj);
      req.session.user_id = admin._id.toHexString();
      req.session.user_role = 'admin';
      res.redirect('/admin/dashboard');
    } catch (e) {
      console.error(`Error logging Admin: ` + e.message);
      next(e);
    }
  }
  static async Dashboard(req, res, next) {
    if (!req.session.user_id) return res.redirect('/admin/login');
    try {
      let applications = await ApplicationDAO.getApplications();
      res.status(200).render('admin/dashboard', {
        title: 'Admin Dashboard',
        user: 'admin',
        applications,
      });
    } catch (e) {
      console.log(`Error Displaying Admin Dashboard: ${e.message}`);
      next(e);
    }
  }
  static async UpdateApplicationStatus(req, res, next) {
    const { id, status } = req.params;
    try {
      let student_id = await ApplicationDAO.getStudentId(id);
      await StudentDAO.updateApplicationStatus(student_id, status);
      return res.redirect('/admin/dashboard');
    } catch (e) {
      console.error(`Error updating application status: ${e.message}`);
      next(e);
    }
  }
  static async ApplicationView(req, res, next) {
    if (!req.session.user_id) return res.redirect('/admin/login');
    const { id } = req.params;
    try {
      let application = await ApplicationDAO.getApplication(id);
      res.render('admin/application', {
        title: 'Application',
        user: 'admin',
        application,
      });
    } catch (e) {
      console.log(`Error displaying application: ${e.message}`);
      next(e);
    }
  }
}
module.exports = AdminController;
