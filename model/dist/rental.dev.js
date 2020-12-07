"use strict";

var Joi = require('joi');

Joi.objectId = require('joi-objectid')(Joi);

var mongoose = require('mongoose');

var Rentals = mongoose.model('rental', new mongoose.Schema({
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
        required: true
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
        "default": 0
      }
    }),
    required: true
  },
  dateOUt: {
    type: Date,
    required: true,
    "default": Date.now
  },
  dateReturned: {
    type: Date
  },
  rentalFee: {
    type: Number,
    "default": 9
  }
}));

function validator(movie) {
  var schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });
  return schema.validate(movie);
}

exports.Rantel = Rentals;
exports.validate = validator;