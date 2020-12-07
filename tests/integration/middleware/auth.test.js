const request = require('supertest');
const { Genres } = require('../../../model/genres.js');
const { User } = require('../../../model/user.js');
let server;


describe('middleware auth', () => {
    beforeEach(() => {
        server = require('../../../server')

    });
    afterEach(async () => {
        await server.close();
        await Genres.deleteMany({})
    })
    let token;
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: "genre1" })
    }
    beforeEach(() => {
        token = new User().generatAauthTokens()
    })
    it('should 401 if no token provided', async () => {
        token = ""
        const res = await exec()
        expect(res.status).toBe(401)
    });
    it('should 400 if we have invalid token wtf', async () => {
        token = "a"
        const res = await exec()
        expect(res.status).toBe(400)

    });
    it('should have a happy pass', async () => {
        const res = await exec()
        expect(res.status).toBe(200)
        // expect(res.body).toBe(token)
    });
});