const storeService = require('../services/storeService');

async function listStores(req, res) {
  res.json(await storeService.listStoresForUser(req.query, req.user.id));
}

module.exports = { listStores };
