const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity")
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isAdmin: Boolean

})

userSchema.methods.generatAauthTokens = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.JWT_PRI)
    return token
}

const User = mongoose.model('User', userSchema)

const complexityOptions = {
    min: 10,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 3,
};
// =requirementCount: 3, این هر چند باشه همون مقدارو به ما گری میده 
function validator(user) {

    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        email: Joi.string().required().email(),
        password: passwordComplexity(complexityOptions),
        isAdmin: Joi.boolean().required()
    })
    return schema.validate(user)
}
// passwordComplexity(passwordO).validate(password);

exports.validate = validator
exports.userSchema = userSchema
exports.User = User





