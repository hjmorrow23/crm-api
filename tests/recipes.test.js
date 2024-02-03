process.env.NODE_ENV = 'test';

const controller = require('../controllers/recipe')
const Recipe = require('../models').recipe;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index.js');
let should = chai.should();


chai.use(chaiHttp);

const db = require('./db')
beforeAll(async () => await db.connect())
afterEach(async () => await db.clearDatabase())
afterAll(async () => await db.closeDatabase())


describe('Recipe CRUD', () => {
    it('get all recipe', async done => {
        chai.request(server)
            .get('/recipes')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                //   res.body.length.should.be.eql(0);
              done();
            });
    })
})