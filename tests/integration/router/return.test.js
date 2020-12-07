
const mongoose = require('mongoose');
const request = require('supertest');
const { Rantel } = require('../../../model/rental');
const { User } = require('../../../model/user');
const moment = require('moment');
const { Movies } = require('../../../model/movie');
const { object } = require('joi');

describe('', () => {
    let server;
    let customerId;
    let movieId;
    let rentel;
    let token;


    const exec = async () => {
        return await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId })
    }

    beforeEach(async () => {
        server = require('../../../server')
        movieId = mongoose.Types.ObjectId()
        customerId = mongoose.Types.ObjectId()
        token = new User().generatAauthTokens()


        movie = new Movies({
            _id: movieId,
            titel: "movie1",
            dailyRentalRate: 2,
            genre: { name: "12345" },
            numbererInStock: 10
        })
        await movie.save()
        rentel = new Rantel({
            customer: {
                _id: customerId,
                name: '123456',
                phone: "12345"
            },
            movie: {
                _id: movieId,
                titel: "movie1",
                dailyRentalRate: 2
            }

        })
        await rentel.save()
    });

    afterEach(async () => {
        await server.close()
        await rentel.remove({})
        await movie.remove({})
        // rentel.deleteMani({})
    });
    it('should send 401 status if the user not login', async () => {
        token = ''
        const res = await exec()
        expect(res.status).toBe(401);
    });
    it('should return 400 err if the coustomer ID not provide', async () => {
        customerId = ''
        // delete payload.customerId

        const res = await exec()
        expect(res.status).toBe(400);
    });
    it('should return 400 err if the movie ID not provide', async () => {
        movieId = ''
        // delete payload.movieId

        const res = await exec()
        expect(res.status).toBe(400);
    });
    it('should return 404 err if the rentelmotfund', async () => {

        rentel.remove({})

        const res = await exec()
        expect(res.status).toBe(404);
    });
    it('should return 400 err if the return all ready proccecd', async () => {

        rentel.dateReturned = new Date()
        await rentel.save()

        const res = await exec()
        expect(res.status).toBe(400);
    });

    it('should return 200 status if we have valid request ', async () => {

        const res = await exec()
        expect(res.status).toBe(200);
    });
    it('should set the return Date if input is valid ', async () => {
        const res = await exec()


        const rentalinDb = await Rantel.findById(rentel._id)

        const diff = new Date() - rentalinDb.dateReturned

        expect(diff).toBeLessThan(10 * 1000);
    });


    it('should set the return calculate the rental Fee', async () => {
        rentel.dateOUt = moment().add(-7, "days").toDate()
        await rentel.save()


        const res = await exec()

        const rentalinDb = await Rantel.findById(rentel._id)
        expect(rentalinDb.rentalFee).toBeDefined();
        expect(rentalinDb.rentalFee).toBe(14);
    });
    it('should increese the movie stok', async () => {
        rentel.dateOUt = moment().add(-7, "days").toDate()
        await rentel.save()


        const res = await exec()

        const movieDb = await Movies.findById(movieId)

        expect(movieDb.numbererInStock).toBe(movie.numbererInStock + 1);


    });

    it('should set the return rantel input is valid', async () => {
        const res = await exec()
        const rentalinDb = await Rantel.findById(rentel._id)
        expect(Object.keys(res.body))
            .toEqual(expect.arrayContaining([
                'dateReturned',
                'dateOUt',
                'movie',
                'customer',
                'rentalFee'
            ]))
    });


});