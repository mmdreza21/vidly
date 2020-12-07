
const auth = require('../middleware/auth')
const express = require('express')
// const validate = require('../middleware/validate')
const router = express.Router()
const { Genres, validate } = require('../model/genres');
const admin = require('../middleware/admin');
const mongoose = require('mongoose');
const validobjectid = require('../middleware/validobjectid');

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let genre = await new Genres({ name: req.body.name })
    genre = await genre.save()

    res.send(genre)

})

router.get('/', async (req, res) => {
    // throw new Error('cold not get the gunres')
    const genre = await Genres.find().sort('name').select('name')
    res.send(genre)

})

router.get('/:id', validobjectid, async (req, res) => {

    const genre = await Genres.findById(req.params.id)

    if (!genre) return res.status(404).send('there is no sutch genre')
    res.send(genre)
})

router.put('/:id', [auth, validobjectid], async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = await Genres.findByIdAndUpdate(req.params.id, {
        name: req.body.name
    }, { new: true })

    if (!genre) return res.status(404).send("cant fined genre")

    res.send(genre)
})

router.delete('/:id', [auth, admin, validobjectid], async (req, res) => {

    const genre = await Genres.findByIdAndRemove(req.params.id)
    if (!genre) return res.status(404).send("we cant found to delet")
    res.send(genre)


})

module.exports = router