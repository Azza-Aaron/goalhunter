const authGuard = (req, res, next) => {
  console.log(req?.session)
  if (req.session?.user?.verified) {
    next();
    return;
  }

  res.status(401)
  res.send()
}

module.exports = {
  authGuard
}
