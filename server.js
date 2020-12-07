require("dotenv").config();
const logger = require('./startup/loger');
const express = require('express');
const app = express()

require('./startup/loger');
require('./startup/routes')(app);
require('./startup/DS')();
require('./startup/validatiion');
require('./jest.config');
require('./startup/prod')(app);


process.on('unhandledRejection', (ex) => {
    throw ex;
})


const port = process.env.PORT || 3000
const server = app.listen(port, () => logger.info(`Example app listening on port ${port}!`))

module.exports = server