module.exports = async function (req, res, proceed) {
  if (req.session.authToken) {
    return proceed();
  }
  return res.status(401).json({
    error: "You have to login first",
  });
};
