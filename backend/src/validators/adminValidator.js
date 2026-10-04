const { z, name, email, address, password, role } = require('./common');

const createUserSchema = z.object({
  name,
  email,
  address,
  password,
  role,
});

const createStoreSchema = z.object({
  name,
  email,
  address,
  ownerId: z.number().int().positive('ownerId must be a positive integer'),
});

module.exports = { createUserSchema, createStoreSchema };
