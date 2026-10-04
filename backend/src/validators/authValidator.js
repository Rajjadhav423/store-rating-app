const { z, name, email, address, password } = require('./common');

const registerSchema = z.object({
  name,
  email,
  address,
  password,
});

const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Old password is required'),
  newPassword: password,
});

module.exports = { registerSchema, loginSchema, changePasswordSchema };
