const mongoose = require('mongoose');
const logger = require("./loger");


module.exports = () => {
    const url = process.env.MONGOLAB_URI
    mongoose.connect(url, {
        useNewUrlParser: true, useUnifiedTopology: true,
        useFindAndModify: false, useCreateIndex: true
    })
        .then(() => logger.info(`conected to MONGO D B whit ${url}`))

}