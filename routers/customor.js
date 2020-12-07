const express = require("express")
const admin = require("../middleware/admin")
const auth = require('../middleware/auth')
const { validat, Customer } = require("../model/customerssch")
const router = express.Router()

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name').select(' name phone isgold')
    res.send(customers)
})

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send('no one can fined suche custemor../()/')
    res.send(customer)
})

router.post('/', auth, async (req, res) => {
    const { error } = validat(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isgold: req.body.isgold
    })
    try {
        await customer.save()
        res.send(customer)
    } catch (ex) {
        res.status(400).send(ex.message)
    }
})

router.put("/:id", async (req, res) => {
    const { error } = validat(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isgold: req.body.isgold
    }, { new: true })
    if (!customer) return res.status(404).send('we can find him to change him')
    try {
        res.send(customer)
    } catch (ex) {
        res.status(400).send(ex.massage)
    }
})

router.delete('/:id', [auth, admin], async (req, res) => {
    const cus = await Customer.findByIdAndRemove(req.params.id)
    !cus ? res.status(404).send('we can not find him by ID to fuck him out') : res.send(cus)
})

module.exports = router