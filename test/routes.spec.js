const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(err => {
      throw err;
    });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/sad')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(err => {
      throw err;
    });
  });
});

describe('API Routes', () => {
  describe('GET api/v1/projects', () => {

    it('should return all the projects', () => {
      return chai.request(server)
      .get('/api/v1/projects')
      // .then(response => console.log(response))
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.res.should.be.a('object');
      })
      .catch(err => {
        throw err;
      });
    });
  });

  describe('POST /api/v1/projects', () => {
    it.skip('should post a new project', () => {
      return chai.request(server)
      .post('/api/v1/projects') 
      .send({                  
        project_name: 'Project 1',
        id: '1'
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal('1');
      })
      .catch(err => {
        throw err;
      });
    });
  });
});
