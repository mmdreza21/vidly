const { createLogger, transports, format } = require('winston')
const winston = require('winston')
require('winston-mongodb')

const logger = createLogger({

    transports: [
        new transports.Console({
            level: 'error',
            level: 'info',
            // format: format.combine(format.timestamp(), format.json())
            format: format.combine(format.timestamp(), format.simple()),
            handleExceptions: true,
            prettyprint: true
        }),
        new transports.File({
            filename: "error.log",
            level: 'error',
            format: format.combine(format.timestamp(), format.json()),
            handleExceptions: true

        }),
        // new transports.MongoDB({
        //     db: 'mongodb://localhost/vidly'
        //     , level: "error",
        //     options: { useUnifiedTopology: true },
        //     collection: "error",
        //     format: format.combine(format.timestamp(), format.json())

        // })
    ]
})




module.exports = logger



// module.exports = function () {
//     //*

//     winston.exceptions.handle(
//         new winston.transport.Console({ colorize: true, prettyprint: true }),
//         new winston.transports.File({ filename: 'uncaughtException.log' })
//     )

//     process.on('unhandledRejection', (ex) => {
//         throw ex;
//     })
// }



// ina  wase * ast k  besoorat dasty neveshte shodan // help

// )
// process.on('uncaughtException', (err) => {
//     console.log('we have uncaught Exception');
//     logger.error('uncaught exception: ', err)
//     process.exit(1)
// })

// process.on('unhandledRejection', (ex) => {
    // console.log('we have unhandled Rejection');
    // logger.error('uncaught exception: ', err)
    // process.exit(1)
    //
//     throw ex;

// })