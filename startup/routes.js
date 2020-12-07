const express = require('express')

const genres = require('../routers/genres')
const movies = require('../routers/movie')
const rental = require('../routers/rental')
const customers = require('../routers/customor')
const user = require('../routers/user');
const auth = require('../routers/auth');
const returns = require('../routers/return');

const error = require('../middleware/error');


module.exports = (app) => {
    app.use(express.json())
    app.use('/api/genres', genres)
    app.use('/api/customers', customers)
    app.use('/api/movie', movies)
    app.use('/api/rental', rental)
    app.use('/api/user', user)
    app.use('/api/auth', auth)
    app.use('/api/returns', returns)
    app.use(error)
}