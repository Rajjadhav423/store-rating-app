const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const ownerController = require('../controllers/ownerController');

const router = express.Router();

router.get('/dashboard', authenticate, authorize('OWNER'), asyncHandler(ownerController.dashboard));

module.exports = router;
