const request = require('supertest');
const app = require('../app');
const { expect } = require('chai');
const { User } = require('../models');

let csrfToken;
let cookieJar;

describe('Auth API', () => {

  beforeEach(async () => {
    await User.create({
        email: "test@mail.com",
        password: "Password123*",
        firstName: "Test",
        lastName: "User",
      });
    
    const res = await request(app)
      .get('/api/csrf-token')
      .set('Accept', 'application/json');

    expect(res.status).to.equal(200);
    csrfToken = res.body.csrfToken;

    const setCookie = res.headers['set-cookie'];
    cookieJar = setCookie.map(cookie => cookie.split(';')[0]).join('; ');
  });

  describe('POST /api/auth/login', () => {
    it('should return token with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('X-CSRF-Token', csrfToken)
        .set('Cookie', cookieJar) 
        .send({
          email: 'test@mail.com',
          password: 'Password123*',
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    });
  });


  describe('POST /api/auth/login', () => {
    it('should return 401 with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .set('X-CSRF-Token', csrfToken)
        .set('Cookie', cookieJar) 
        .send({
          email: 'invalid@mail.com',
          password: 'invalid',
        });

      expect(res.status).to.equal(401);
    });
  });


});
