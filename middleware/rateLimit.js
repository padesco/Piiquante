const rateLimit = require('express-rate-limit');

const connexionLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    handler: function (req, res, /*next*/) {
        return res.status(429).json({
          error: 'You sent too many requests. Please wait a minute then try again'
        })
    }
})

module.exports = connexionLimiter;