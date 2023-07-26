module.exports = async function (req, res, proceed) {
  const { email } = req.allParams();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: `${email} is not found` });
    } else if (user.emailStatus === "unconfirmed") {
      res.status(401).json({ error: `${email} is not confirmed` });
    } else {
      return proceed();
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
