const ownerService = require('../services/ownerService');

async function dashboard(req, res) {
  res.json(await ownerService.getOwnerDashboard(req.user.id));
}

module.exports = { dashboard };
