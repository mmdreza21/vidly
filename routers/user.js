const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const _ = require('lodash')
const router = express.Router()
const { User, validate } = require('../model/user')
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const config = require('config')



router.get('/', async (req, res) => {
    const user = await User.find().sort("name")
    res.send(user)
})

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).sort("name")
    !user ? res.status(400).send('there is no a user whit givin ID') : res.send(user)

})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send("the USER is alredy Regesterd")

    user = await new User(_.pick(req.body, ['name', "email", 'password', "isAdmin"]))
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    try {
        await user.save()
        const token = user.generatAauthTokens()
        res.header('x-auth', token).send(_.pick(user, ['_id', "name", 'email', 'isAdmin']))
    } catch (ex) {
        res.status(400).send(ex.message)
    }
})


router.delete('/:id', [auth, admin], async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    !user ? res.status(400).send('there is no a user whit givin ID') : res.send(user)

})

module.exports = router






// way out of your lee