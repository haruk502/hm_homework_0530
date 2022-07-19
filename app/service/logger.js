const moment = require('moment')

module.exports = function(req, res, next) {
  console.log(`[${moment().format("YYYY-MM-DD HH:mm:ssZ")}] ${req.method} ${req.path}`)
  next()
}
