const express = require('express');
const StudentDAO = require('../models/student.dao');
class HomeController {
  static Index(req, res, next) {
    res.render('home', { title: 'Home', user: req.session.user_role });
  }
  static async VerifyEmail(req, res, next) {
    const { id } = req.params;
    try {
      if (await StudentDAO.verifyStudent(id))
        return res.redirect('/student/login');
      res.send('Not Verified');
    } catch (err) {
      console.log(`Error Verifying Email: ${err.message}`);
      next(e);
    }
  }
  static ErrorView(req, res, next) {
    res.render('error', { title: 'Error', layout: false });
  }
}

module.exports = HomeController;
