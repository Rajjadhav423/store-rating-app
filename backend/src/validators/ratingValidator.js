const { z } = require('./common');

const ratingSchema = z.object({
  storeId: z.number().int().positive('storeId must be a positive integer'),
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
});

module.exports = { ratingSchema };
