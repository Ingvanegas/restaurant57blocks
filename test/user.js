const request = require("supertest");
const Auth = require("../dist/src/security/auth").default;

describe('loading express', () => {
  var server = require('../dist/src/server');

  it('Get users without token', (done) => {
    request(server)
      .get('/users')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  it('Create a user with a invalid email', (done) => {    
    request(server)
      .post('/user')
      .send({email: 'testtest.com'})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });

  it('Create a user with a invalid password', (done) => {    
    request(server)
      .post('/user')
      .send({password: 'test'})
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        return done();
      });
  });
});