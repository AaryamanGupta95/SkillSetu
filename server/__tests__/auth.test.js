const request = require('supertest');
const { app } = require('../server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../models', () => {
  return {
    User: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
    Wallet: {
      create: jest.fn(),
      findOne: jest.fn(),
    },
    Certificate: {},
    Achievement: {},
  };
});

jest.mock('../utils/mailer', () => ({
  sendMail: jest.fn(),
  templates: {
    welcome: jest.fn().mockReturnValue({ subject: 'Welcome', text: 'Welcome' }),
  },
}));

const { User, Wallet } = require('../models');

describe('Auth APIs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 if user already exists', async () => {
      // Mock User.findOne to return a user (simulating existing user)
      User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('An account with this email already exists.');
    });

    it('should create a new user and wallet', async () => {
      // Mock User.findOne to return null (no existing user)
      User.findOne.mockResolvedValue(null);
      // Mock User.create to return new user
      const mockUser = {
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };
      User.create.mockResolvedValue(mockUser);
      // Mock Wallet.create
      Wallet.create.mockResolvedValue({ id: 1, userId: 1, balance: 150 });

      // Ensure JWT secret is set for the test
      process.env.JWT_SECRET = 'testsecret';

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe('Account created successfully!');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', 'test@example.com');
      
      expect(User.create).toHaveBeenCalled();
      expect(Wallet.create).toHaveBeenCalledWith({ userId: 1, balance: 150 });
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 404 if user not found', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('User not found.');
    });

    it('should return 400 if password does not match', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      User.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: hashedPassword,
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('Invalid email or password.');
    });

    it('should login successfully with correct credentials', async () => {
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      User.findOne.mockResolvedValue({
        id: 1,
        fullName: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'user'
      });
      Wallet.findOne.mockResolvedValue({ balance: 150 });
      process.env.JWT_SECRET = 'testsecret';

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'correctpassword',
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Login successful!');
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.walletBalance).toBe(150);
    });
  });
});
