
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)

const mongoose = require('mongoose');
const moment = require('moment');

const rentelschema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                maxlength: 50,
                minlength: 5
            },
            isgold: {
                type: Boolean,
                required: true,
                default: true
            },
            phone: {
                type: String,
                required: true,
                maxlength: 50,
                minlength: 5
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            titel: {
                type: String,
                required: true,
                minlength: 1,
                maxlength: 250
            },

            dailyRentalRate: {
                type: Number,
                default: 0
            }
        }),
        required: true
    },
    dateOUt: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date,

    },
    rentalFee: {
        type: Number,

    },
})
rentelschema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId
        , 'movie._id': movieId
    })
}
rentelschema.methods.return = function () {
    this.dateReturned = new Date()

    const rentaldays = moment().diff(this.dateOUt, 'days')
    this.rentalFee = rentaldays * this.movie.dailyRentalRate
}

const Rentals = mongoose.model('rental', rentelschema)

function validator(movie) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),

    })
    return schema.validate(movie)
}


exports.Rantel = Rentals

exports.validate = validator