const logger = require("../startup/loger")

module.exports = function (err, req, res, next) {

    logger.error(err.message, err)

    res.status(500).send("some thing went wrong")
}




    // winston.log("error",err.message)//deprecated

    //levels of logs in winstone:::::::>>>S//help
    //error
    //warn
    //info
    //verbose
    //debug
    //silly
