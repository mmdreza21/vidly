const Joi = require("joi")
const mongoose = require('mongoose');


const genresSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 5, maxlength: 50 },

})


const Genres = mongoose.model("genres", genresSchema)

function validatorG(movie) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),


    })
    return schema.validate(movie)
}

exports.genresSchema = genresSchema
exports.Genres = Genres
exports.validate = validatorG