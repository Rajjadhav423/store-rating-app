const ratingService = require('../services/ratingService');

async function upsertRating(req, res) {
  const rating = await ratingService.upsertRating(req.user.id, req.body);
  res.status(201).json(rating);
}

async function getMyRating(req, res) {
  const rating = await ratingService.getUserRating(req.user.id, Number(req.params.storeId));
  res.json({ rating });
}

async function getStoreRatings(req, res) {
  const ratings = await ratingService.getStoreRatings(Number(req.params.storeId), req.user);
  res.json({ ratings });
}

module.exports = { upsertRating, getMyRating, getStoreRatings };
