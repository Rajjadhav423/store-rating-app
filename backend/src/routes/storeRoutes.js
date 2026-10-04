const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const storeController = require('../controllers/storeController');

const router = express.Router();

router.get('/', authenticate, authorize('USER'), asyncHandler(storeController.listStores));

module.exports = router;
