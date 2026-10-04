const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createUserSchema, createStoreSchema } = require('../validators/adminValidator');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', asyncHandler(adminController.dashboard));
router.post('/users', validate(createUserSchema), asyncHandler(adminController.createUser));
router.get('/users', asyncHandler(adminController.listUsers));
router.get('/users/:id', asyncHandler(adminController.getUser));
router.post('/stores', validate(createStoreSchema), asyncHandler(adminController.createStore));
router.get('/stores', asyncHandler(adminController.listStores));

module.exports = router;
