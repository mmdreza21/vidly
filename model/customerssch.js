const Joi = require("joi")

const mongoose = require('mongoose');

const Customer = mongoose.model('customers', new mongoose.Schema({


    name: { type: String, required: true, maxlength: 50, minlength: 5 },
    isgold: { type: Boolean, required: true },
    phone: { type: String, required: true, maxlength: 50, minlength: 5 }

}))


function validatorC(custuner) {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(50),
        phone: Joi.string().required().min(5).max(50),
        isgold: Joi.boolean()

    })
    return schema.validate(custuner)
}


exports.validat = validatorC

exports.Customer = Customer;