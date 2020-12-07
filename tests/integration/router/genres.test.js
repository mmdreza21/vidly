
const mongose = require('mongoose');
const request = require('supertest');
let server;

const { Genres } = require('../../../model/genres.js');
const { User } = require('../../../model/user.js');

describe('/api/genres', () => {
    beforeEach(() => {
        server = require('../../../server.js')
    });
    afterEach(async () => {
        await server.close();
        await Genres.deleteMany({})

    });
    describe('GET /', () => {

        it('should return all genres', async () => {
            await Genres.collection.insertMany([
                { name: "genre1" },
                { name: "genre2" }
            ])

            const res = await request(server).get('/api/genres')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name = "genre1")).toBeTruthy();
            expect(res.body.some(g => g.name = "genre2")).toBeTruthy();
        });
    });
    describe('GET /:id', () => {
        it('should retun a genra if we pass a valid ID', async () => {
            const genre = new Genres({ name: "genre1" })
            await genre.save()
            const res = await request(server).get(`/api/genres/${genre._id}`)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("name", genre.name);
        });

        it('should send a 404 status if the id is wrong', async () => {
            const res = await request(server).get('/api/genres/1111')
            expect(res.status).toBe(404)
        });
        it('should send a 404 the genre not fund', async () => {
            const id = mongose.Types.ObjectId()
            const res = await request(server).get('/api/genres/' + id)
            expect(res.status).toBe(404)
        });


    });

    describe('POST /', () => {

        let token;
        let name;
        const exec = async () => {

            return await request(server)
                .post("/api/genres")
                .set('x-auth-token', token)
                .send({ name })
        }
        beforeEach(() => {
            token = new User().generatAauthTokens()
            name = "genre1"
        })
        it('should status us 401 if user not login', async () => {

            token = ''
            const res = await exec()
            expect(res.status).toBe(401)

        });
        it('should return 400 status if user les than 5', async () => {
            name = "1234"
            const res = await exec()
            expect(res.status).toBe(400)
        });
        it('should return 400 again if the name more than 50', async () => {

            name = new Array(52).join("a")

            const res = await exec()
            expect(res.status).toBe(400)
        });
        it('should send the genra if its valid', async () => {

            await exec()
            const genra = await Genres.find({ name: "genre1" })
            expect(genra).not.toBeNull();
        });
        it('should return genra if its valid', async () => {

            const res = await exec()
            // console.log(res);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
    describe('PUT /:id', () => {
        let token;
        let name;
        let newName
        let id;
        const exec = async () => {

            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({ name: newName })
        }

        beforeEach(async () => {
            // Before each test we need to create a genre and 
            // put it in the database.      
            genre = new Genres({ name: 'genre1' });
            await genre.save();

            token = new User().generatAauthTokens();
            id = genre._id;
            newName = 'updatedName';
        })

        it('should status us 401 if user not login', async () => {

            token = ''
            const res = await exec()
            expect(res.status).toBe(401)

        });

        it('should return a 400 if the name is less than 5 ', async () => {
            newName = "1234"
            const res = await exec()
            expect(res.status).toBe(400)
        });
        it('should return a 400 if the name is more than 50 ', async () => {
            newName = new Array(52).join("a")

            const res = await exec()
            expect(res.status).toBe(400)
        });
        it('should return 404 if the Id is invalid', async () => {
            id = "1"
            const res = await exec()
            expect(res.status).toBe(404)

        });
        it('should return 404 if the genre not fund with givin ID', async () => {
            id = mongose.Types.ObjectId().toHexString()
            const res = await exec()
            expect(res.status).toBe(404)
        });
        it('should happy pass us whit 200 status', async () => {
            const res = await exec()
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("name", "updatedName");
        });
        it('should UPDATE the genra successfuly', async () => {
            await exec()
            genre = Genres.find({ name: newName })
            expect(genre).toBeDefined();

        });
    });
    describe(' DELETE /:id', () => {
        let token;
        let id;
        let genre;
        let name;
        let header;
        const exec = async () => {
            return await request(server)
                .delete(`/api/genres/${id}`)
                .set('x-auth-token', token)
                .send()
        }

        beforeEach(async () => {
            genre = new Genres({ name: "genre1" })
            await genre.save()
            id = genre._id
            token = new User({ isAdmin: true }).generatAauthTokens()

        });
        it('should return 401 if user not login', async () => {
            token = ""
            const res = await exec()
            expect(res.status).toBe(401)
        });
        it('should return 403 if the user in not admin', async () => {
            token = new User({ isAdmin: false }).generatAauthTokens()
            const res = await exec()
            expect(res.status).toBe(403)
        });
        it('should return 404 if you have invalid id', async () => {
            id = " 1"
            const res = await exec()
            expect(res.status).toBe(404)

        });
        it('should return 404 if the genra notfund with given id ', async () => {
            id = mongose.Types.ObjectId().toHexString()
            const res = await exec()
            expect(res.status).toBe(404)
        });
        it('should  return 200 status and delet the genre', async () => {
            const res = await exec()
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty("name", genre.name)
        });
        it('should return 200 if deleted the genre ', async () => {
            await exec()
            deletedgenre = await Genres.findById(id)
            expect(deletedgenre).toBeNull();
        });

    });
});