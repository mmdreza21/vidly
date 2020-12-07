const Fawn = require('fawn')
const express = require('express');
const { Rantel, validate } = require('../model/rental')
const { Movies } = require('../model/movie')
const { Customer } = require('../model/customerssch')
const auth = require('../middleware/auth')
const router = express.Router()
const mongoose = require('mongoose');
const admin = require('../middleware/admin');

Fawn.init(mongoose)

router.get("/", async (req, res) => {
    const rantel = await Rantel.find().sort('customer')
    //   // !rantel ? res.status(404).send('cant fined rantel') :
    res.send(rantel)
})

router.get("/:id", async (req, res) => {
    const rantel = await Rantel.findById(req.params.id)
    !rantel ? res.status(404).send('cant fined rantel') : res.send(rantel)
})

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)


    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(404).send('ivalid customer')

    const movie = await Movies.findById(req.body.movieId)
    if (!movie) return res.status(404).send('ivalid movie')

    if (movie.numbererInStock === 0) return res.status(400).send('sorry we dont have that movie any more')
    const rental = await new Rantel({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isgold: customer.isgold
        },
        movie: {
            _id: movie._id,
            titel: movie.titel,
            dailyRentalRate: movie.dailyRentalRate
        },

        rentalFee: req.body.rentalFee,

    })
    try {
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numbererInStock: -1 }
            })
            .run()
        res.send(rental)
    } catch (ex) {
        res.status(400).send(ex.message)
    }
})



router.delete("/:id", [auth, admin], async (req, res) => {
    const rantel = await Rantel.findByIdAndRemove(req.params.id)
    !rantel ? res.status(404).send('cant fined rantel') : res.send(rantel)
})

module.exports = router