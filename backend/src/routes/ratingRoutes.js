const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { ratingSchema } = require('../validators/ratingValidator');
const ratingController = require('../controllers/ratingController');

const router = express.Router();

router.post('/', authenticate, authorize('USER'), validate(ratingSchema), asyncHandler(ratingController.upsertRating));
router.get('/my/:storeId', authenticate, authorize('USER'), asyncHandler(ratingController.getMyRating));
router.get('/store/:storeId', authenticate, authorize('ADMIN', 'OWNER'), asyncHandler(ratingController.getStoreRatings));

module.exports = router;
