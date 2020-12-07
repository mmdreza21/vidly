const { number } = require('joi');
const Joi = require('joi');
const mongoose = require('mongoose');
const { genresSchema } = require('./genres');



const Movies = mongoose.model('movie', new mongoose.Schema({
    titel: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 250
    },
    genre: {
        type: genresSchema,
        required: true
    },
    numbererInStock: {
        type: Number,
        default: 0
    },
    dailyRentalRate: {
        type: Number,
        default: 0
    }
}))

function validatorM(movie) {
    const schema = Joi.object({
        titel: Joi.string().required().min(5).max(50),
        genreId: Joi.objectId().required(),
        numbererInStock: Joi.number(),
        dailyRentalRate: Joi.number()
    })
    return schema.validate(movie)
}


exports.Movies = Movies
// exports.Genre = Genres

exports.validateM = validatorM

