const adminService = require('../services/adminService');

async function dashboard(req, res) {
  res.json(await adminService.dashboardStats());
}

async function createUser(req, res) {
  res.status(201).json(await adminService.createUser(req.body));
}

async function listUsers(req, res) {
  res.json(await adminService.listUsers(req.query));
}

async function getUser(req, res) {
  res.json(await adminService.getUserById(Number(req.params.id)));
}

async function createStore(req, res) {
  res.status(201).json(await adminService.createStore(req.body));
}

async function listStores(req, res) {
  res.json(await adminService.listStores(req.query));
}

module.exports = { dashboard, createUser, listUsers, getUser, createStore, listStores };
