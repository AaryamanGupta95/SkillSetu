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

// Mock dependencies
jest.mock('../models', () => {
  return {
    User: {
      findByPk: jest.fn(),
      findAndCountAll: jest.fn(),
      findAll: jest.fn(),
      count: jest.fn(),
    },
    Achievement: {},
    Rating: {
      findAll: jest.fn(),
    },
    Wallet: {},
    Badge: {},
    Certificate: {},
    UserBadge: {},
  };
});

const { User } = require('../models');

describe('Users APIs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users/stats', () => {
    it('should return platform statistics', async () => {
      User.count.mockResolvedValue(100);

      const res = await request(app).get('/api/users/stats');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('totalUsers', 100);
      expect(res.body).toHaveProperty('activeProjects', 0);
    });
  });

  describe('GET /api/users/leaderboard', () => {
    it('should return top users', async () => {
      const mockUsers = [
        { id: 1, fullName: 'Top User', reputationScore: 500 }
      ];
      User.findAll.mockResolvedValue(mockUsers);

      const res = await request(app).get('/api/users/leaderboard');

      expect(res.statusCode).toEqual(200);
      expect(res.body.users).toEqual(mockUsers);
    });
  });
});
