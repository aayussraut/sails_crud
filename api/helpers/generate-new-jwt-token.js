const jwt = require("jsonwebtoken");

module.exports = {
  friendlyName: "Generate new jwt token",

  description: "",

  inputs: {
    subject: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    const payload = {
      sub: inputs.subject,
      iss: "Issuers name",
    };
    const secret = sails.config.custom.jwtSecret;

    const token = jwt.sign(payload, secret, { expiresIn: "1h" });
    return token;
  },
};
