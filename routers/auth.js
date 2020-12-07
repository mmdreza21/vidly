const express = require('express')
const config = require('config')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const _ = require('lodash')
const router = express.Router()
const { User } = require('../model/user');
const Joi = require('joi');

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Invalid Email or password")

    const validpassword = await bcrypt.compare(req.body.password, user.password)
    if (!validpassword) return res.status(400).send("Invalid Email or password")

    const token = user.generatAauthTokens()
    res.send(token)

})

function validate(user) {

    const schema = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required()
    })
    return schema.validate(user)
}

// router.get('/', async (req, res) => {

// })


module.exports = router