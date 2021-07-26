const path = require('path');
const { ObjectId } = require('mongodb');
const StudentDAO = require('../models/student.dao');
const ApplicationDAO = require('../models/application.dao');
const { uploadFile, isFileInLimit } = require('../file-function');
const hashPwd = require('../password-hashing');
const MailUtility = require('../MailUtility');
const FILE_SIZE_LIMIT = 2 * 1024 * 1024;

class StudentController {
  static SignupView(req, res, next) {
    if (req.session.user_id) return res.redirect('/student/');
    res.render('student/signup', { title: 'Signup - Student' });
  }
  static LoginView(req, res, next) {
    if (req.session.user_id) return res.redirect('/student/');
    res.render('student/login', { title: 'Login - Student' });
  }
  static Logout(req, res, next) {
    req.session.destroy();
    res.redirect(`/student/login`);
  }
  static async #SendVerificationEmail(request, response, to, code) {
    const {
      protocol,
      headers: { host },
    } = request;
    try {
      let html = await MailUtility.getMailingHtml(response, 'emailTemplate', {
        layout: false,
        baseUrl: `${protocol}://${host}`,
        verificationId: code,
      });
      await MailUtility.sendMail({
        to: to,
        subject: 'Verification Email | NodeSchool',
        html: html,
      });
    } catch (e) {
      console.error(`Error Sending Mail: ${e.message}`);
      throw e;
    }
  }
  static async Signup(req, res, next) {
    const errorObj = {
      error: true,
      title: 'Signup - Student',
      message: '',
    };

    const { email, password, confirm_password } = req.body;
    if (!email || !password || !confirm_password)
      errorObj.message = 'Must Fill out all fields';
    else if (await StudentDAO.getStudentWithEmail(email))
      errorObj.message = 'Student With this Email already exists';
    else if (password != confirm_password)
      errorObj.message = 'Password and Confirm Password must be the same';
    if (errorObj.message)
      return res.status(400).render('student/signup', errorObj);

    try {
      let hash = await hashPwd.generatePasswordHash(password);
      let result = await StudentDAO.addStudent({ email, password: hash });

      if (result) {
        await StudentController.#SendVerificationEmail(req, res, email, result);
        errorObj.error = false;
        errorObj.message =
          'A Verification Email is sent to your Email Address! Please Verify to Continue';
      } else {
        errorObj.message = 'Error Signing up, Try Again!';
      }
      return res.status(400).render('student/signup', errorObj);
    } catch (e) {
      next(e);
    }
  }

  static async Login(req, res, next) {
    if (req.session.user_id) return res.redirect('/student/');

    const errorObj = {
      error: true,
      title: 'Login - Student',
      message: '',
    };
    const { email, password } = req.body;
    if (!email || !password) {
      errorObj.message = 'Must Fill out all fields';
      return res.status(400).render('student/login', errorObj);
    }
    try {
      let student = await StudentDAO.getStudentWithEmail(email);
      if (!student) errorObj.message = 'Student With this Email Does Not Exist';
      else if (!(await hashPwd.comparePassword(password, student.password)))
        errorObj.message = 'Incorrect Password';
      else if (!student.isVerified)
        errorObj.message =
          'Email is not verified! Please Visit the Email Address to Verify!';
      if (errorObj.message)
        return res.status(400).render('student/login', errorObj);
      req.session.user_id = student._id.toHexString();
      req.session.user_role = 'student';
      res.redirect('/student');
    } catch (e) {
      console.error(`Error logging user` + e.message);
      next(e);
    }
  }

  static async Index(req, res, next) {
    if (!req.session.user_id) return res.redirect('/student/login');
    res.render('student/index', {
      title: 'Home - Student',
      user: 'student',
      student: await StudentDAO.getStudentWithId(req.session.user_id),
      application: await ApplicationDAO.getStudentApplication(
        req.session.user_id
      ),
    });
  }

  static async ApplicationSubmit(req, res, next) {
    if (!req.session.user_id) return res.redirect('/student/login');
    const user_id = req.session.user_id;
    const errorObj = {
      error: true,
      title: 'Home - Student',
      message: '',
      user: 'student',
      student: await StudentDAO.getStudentWithId(user_id),
    };
    let file = req.files?.filename;
    if (!file) errorObj.message = 'Must Upload the Photo';
    else if (!isFileInLimit(file, FILE_SIZE_LIMIT))
      errorObj.message = 'Image size must be less than 2Mb';
    else if (Object.values(req.body).some(val => !val))
      errorObj.message = 'Must fill Out All the fields';
    if (errorObj.message)
      return res.status(400).render('student/index', errorObj);
    try {
      file.name = `${user_id}${path.extname(file.name)}`;
      req.body.image = file.name;
      req.body.student_id = new ObjectId(user_id);
      req.body.applied_at = new Date();
      await ApplicationDAO.saveApplication(req.body);
      await StudentDAO.updateApplicationStatus(user_id, 'submitted');
      await uploadFile(file);
      errorObj.error = false;
      errorObj.student = await StudentDAO.getStudentWithId(user_id);
      errorObj.application = await ApplicationDAO.getStudentApplication(
        req.session.user_id
      );
      return res.status(400).render('student/index', errorObj);
    } catch (e) {
      console.error(e);
      next(e);
    }
  }
}

module.exports = StudentController;
