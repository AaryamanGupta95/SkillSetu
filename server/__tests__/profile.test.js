const request = require('supertest');
const { app } = require('../server');

// Mock middleware
jest.mock('../middleware/auth', () => ({
  auth: (req, res, next) => {
    req.userId = 1;
    next();
  },
  adminAuth: (req, res, next) => next(),
  recruiterAuth: (req, res, next) => next(),
}));

// Mock upload middleware
jest.mock('../middleware/upload', () => ({
  single: () => (req, res, next) => {
    req.file = { filename: 'test-image.jpg' };
    next();
  }
}));

// Mock dependencies
jest.mock('../models', () => {
  return {
    User: {
      findByPk: jest.fn(),
    },
    Certificate: {
      create: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
    },
    Achievement: {},
  };
});

const { User } = require('../models');

describe('Profile APIs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/profile', () => {
    it('should return 404 if user not found', async () => {
      User.findByPk.mockResolvedValue(null);

      const res = await request(app).get('/api/profile');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('User not found');
    });

    it('should return user profile', async () => {
      const mockUser = {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com'
      };
      User.findByPk.mockResolvedValue(mockUser);

      const res = await request(app).get('/api/profile');

      expect(res.statusCode).toEqual(200);
      expect(res.body.user).toEqual(mockUser);
    });
  });
});
