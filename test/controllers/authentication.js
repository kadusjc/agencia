var app = require('../../app')
, expect = require('chai').expect
, request = require('supertest')(app)
, User = require('../../app/models').User;

describe('Auth Controller', function() {

  var currentUser = null;

  beforeEach(function(done){
    var options = {
      firstName: 'userTest',
      lastName: 'userTestLogin',
      password: 'userTestPassword',
      email: 'valid@email.com'
    };
    User.register(options, function(err, obj){
      if (err) return done(err);
      currentUser = obj;
      done();
    });
  });

  afterEach(function(done){
    User.destroy().success(function(){
      done();
    });
  });

  it('when user is valid then authenticate', function(done){
    var options = { user: { email: currentUser.email, password: 'userTestPassword' } };
    request
      .post('/authenticate')
      .set('Accept', 'application/json')
      .send(options)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        expect(res.body.firstName).to.equal('userTest');
        done();
      });
  });

  it('when user is valid then register', function(done){
    var options = {
      user: {
        email: 'somevalid@email.com',
        password: 'valid-password',
        firstName: 'User Test First Name',
        lastName: 'User Last Name'
      }
    };
    request
      .post('/register')
      .set('Accept', 'application/json')
      .send(options)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        expect(res.body.firstName).to.equal('User Test First Name');
        done();
      });
  });

  it('should change a existing password', function(done){
    var options = {
      user: {
        id: currentUser.id,
        password: 'new-password'
      }
    };
    request
      .post('/changePassword')
      .set('Accept', 'application/json')
      .send(options)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        expect(res.status).to.equal(200);
        done();
      });
  });

});
