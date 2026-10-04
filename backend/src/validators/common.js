const { z } = require('zod');

const name = z
  .string()
  .min(20, 'Name must be at least 20 characters')
  .max(60, 'Name must be at most 60 characters');

const address = z.string().max(400, 'Address must be at most 400 characters');

const email = z.string().email('Invalid email address').transform((value) => value.toLowerCase());

const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const role = z.enum(['ADMIN', 'USER', 'OWNER']);

module.exports = { z, name, address, email, password, role };
