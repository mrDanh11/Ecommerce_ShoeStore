
const express = require('express');
const router = express.Router();
const { register, login, oauthGoogle } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/oauth/google', oauthGoogle);

module.exports = router;
