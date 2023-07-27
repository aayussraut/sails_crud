module.exports = async function (req, res, proceed) {
  //if user already logged in then show u are already logged in else procced
  if (req.session.authToken) {
    return res.status(403).json({
      error: "You are already logged in",
    });
  }
  return proceed();
};
