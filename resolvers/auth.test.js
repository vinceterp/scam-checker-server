const resolvers = require('./auth');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Auth Resolvers', () => {
  describe('register', () => {
    it('should throw error if user exists', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue({});
      await expect(resolvers.Mutation.register(null, { name: 'Test', email: 'test@test.com', password: 'pass' }))
        .rejects.toThrow('User already exists');
    });
    it('should create user and return token', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed');
      jest.spyOn(User, 'create').mockResolvedValue({ id: '1', name: 'Test', email: 'test@test.com', password: 'hashed' });
      jest.spyOn(jwt, 'sign').mockReturnValue('token');
      const result = await resolvers.Mutation.register(null, { name: 'Test', email: 'test@test.com', password: 'pass' });
      expect(result.token).toBe('token');
      expect(result.user).toBeDefined();
    });
  });
  describe('login', () => {
    it('should throw error if user not found', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue(null);
      await expect(resolvers.Mutation.login(null, { email: 'test@test.com', password: 'pass' }))
        .rejects.toThrow('Invalid credentials');
    });
    it('should throw error if password invalid', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue({ password: 'hashed' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      await expect(resolvers.Mutation.login(null, { email: 'test@test.com', password: 'pass' }))
        .rejects.toThrow('Invalid credentials');
    });
    it('should return token if credentials valid', async () => {
      jest.spyOn(User, 'findOne').mockResolvedValue({ id: '1', password: 'hashed', name: 'Test', email: 'test@test.com' });
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwt, 'sign').mockReturnValue('token');
      const result = await resolvers.Mutation.login(null, { email: 'test@test.com', password: 'pass' });
      expect(result.token).toBe('token');
      expect(result.user).toBeDefined();
    });
  });
});
