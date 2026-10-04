const { registerSchema } = require('../src/validators/authValidator');
const { ratingSchema } = require('../src/validators/ratingValidator');

describe('validation rules', () => {
  test('register schema enforces name/password requirements', () => {
    const result = registerSchema.safeParse({
      name: 'Short Name',
      email: 'user@example.com',
      address: 'Address',
      password: 'password',
    });

    expect(result.success).toBe(false);
  });

  test('rating allows only 1 to 5', () => {
    expect(ratingSchema.safeParse({ storeId: 1, rating: 0 }).success).toBe(false);
    expect(ratingSchema.safeParse({ storeId: 1, rating: 6 }).success).toBe(false);
    expect(ratingSchema.safeParse({ storeId: 1, rating: 5 }).success).toBe(true);
  });
});
