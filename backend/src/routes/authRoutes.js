const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const authenticate = require('../middleware/auth');
const { registerSchema, loginSchema, changePasswordSchema } = require('../validators/authValidator');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.post('/change-password', authenticate, validate(changePasswordSchema), asyncHandler(authController.changePassword));
router.post('/logout', authenticate, asyncHandler(authController.logout));

module.exports = router;
