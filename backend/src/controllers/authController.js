const authService = require('../services/authService');

async function register(req, res) {
  const data = await authService.register(req.body);
  res.status(201).json(data);
}

async function login(req, res) {
  const data = await authService.login(req.body);
  res.json(data);
}

async function changePassword(req, res) {
  await authService.changePassword(req.user.id, req.body);
  res.json({ message: 'Password changed successfully' });
}

async function logout(_req, res) {
  res.json({ message: 'Logged out successfully. Please delete your token client-side.' });
}

module.exports = { register, login, changePassword, logout };
