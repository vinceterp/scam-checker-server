const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../auth/authMiddleware');

describe('Auth Middleware', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use((req, res, next) => {
      req.headers.authorization = req.headers.authorization || '';
      next();
    });
    app.use(authMiddleware);
    app.get('/test', (req, res) => {
      res.json({ user: req.user });
    });
  });

  it('should attach user to req if token is valid', async () => {
    const token = jwt.sign({ userId: 'testid' }, 'testsecret');
    const res = await request(app)
      .get('/test')
      .set('Authorization', `Bearer ${token}`);
    expect(res.body.user).toBeDefined();
  });

  it('should set req.user to null if token is invalid', async () => {
    const res = await request(app)
      .get('/test')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.body.user).toBeNull();
  });
});
