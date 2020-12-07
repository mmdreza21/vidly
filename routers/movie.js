const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const { validateM, Movies } = require('../model/movie')
const { Genres } = require('../model/genres');
const admin = require('../middleware/admin');


router.get('/', async (req, res) => {
    const movie = await Movies.findOne().sort("name")
    res.send(movie)
})

router.get('/:id', async (req, res) => {
    const movie = await Movies.findById(req.params.id)
    !movie ? res.status(404).send('we can not find him by ID to fuck him out') : res.send(movie)

    res.send(movie)
})

router.post('/', auth, async (req, res) => {
    const { error } = validateM(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = await Genres.findById(req.body.genreId)
    if (!genre) return res.status(404).send("invalid genre")

    const movie = await new Movies({
        titel: req.body.titel,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numbererInStock: req.body.numbererInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })
    try {
        await movie.save()
        res.send(movie)
    } catch (ex) {
        res.status(400).send(ex.message)
    }

})
router.put('/:id', async (req, res) => {
    const { error } = validateM(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const genre = await Genres.findById(req.body.genreId)
    if (!genre) return res.status(404).send("invalid genre")

    const movie = await Movies.findOneAndUpdate(req.params.id, {
        titel: req.body.titel,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numbererInStock: req.body.numbererInStock,
        dailyRentalRate: req.body.dailyRentalRate
    }, { new: true })
    if (!movie) return res.status(404).send('we can not find him by ID to fuck him out')

    try {
        res.send(movie)
    } catch (ex) {
        res.status(400).send(ex.message)
    }
})
router.delete('/:id', [auth, admin], async (req, res) => {
    const mov = await Movies.findByIdAndRemove(req.params.id)
    !mov ? res.status(404).send('we can not find him by ID to fuck him out') : res.send(mov)
})

module.exports = router