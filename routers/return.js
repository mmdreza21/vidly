const express = require('express')
const auth = require('../middleware/auth')
const { Rantel, validate } = require('../model/rental')
const router = express.Router()
const { Movies } = require('../model/movie');


router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const rantel = await Rantel.lookup(req.body.customerId, req.body.movieId)

    if (!rantel) return res.status(404).send('not found')
    if (rantel.dateReturned) return res.status(400).send('we have the date')

    rantel.return()

    await rantel.save()

    await Movies.update({ _id: rantel.movie._id }, {
        $inc: { numbererInStock: 1 }
    })

    return res.send(rantel)

})


module.exports = router