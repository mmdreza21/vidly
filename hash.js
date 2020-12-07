const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
const port = 3000




app.get('/peransa', async (req, res) => {
    const token = await jwt.sign({ message: "I Love ypu peransa  خیلی دوست دارم دخترچیم با قلب از طرف محمد رضا" }, ('peransa'))
    console.log(token);
    res.send(token)
})
app.listen(port, () => console.log(`Example app listening on port port!`))




