module.exports = function auth(req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.render('login.ejs', {
      message: ''
    })
  }
}
