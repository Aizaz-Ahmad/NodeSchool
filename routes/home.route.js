const express = require('express');
const router = express.Router();
const HomeCtlr = require('../controllers/home.controller');

router.get('/', HomeCtlr.Index);
router.get('/verify/:id', HomeCtlr.VerifyEmail);
router.get('/error', HomeCtlr.ErrorView);
module.exports = router;
