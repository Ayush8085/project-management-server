const { loginUser, signupUser, accessTokenFromRefreshToken } = require('../constrollers/userController');

const router = require('express').Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.get('/refresh', accessTokenFromRefreshToken);

module.exports = router;