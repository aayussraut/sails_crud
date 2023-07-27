const jwt = require("jsonwebtoken");
module.exports = {
  friendlyName: "Get user from token",

  description: "",

  inputs: {
    token: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      outputFriendlyName: "User from token",
    },
    invalidToken: {
      statusCode: 401,
      description: "Invalid token",
    },
    noUserFound: {
      statusCode: 404,
      description: "User not found",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const token = inputs.token;
      const { sub: email } = await jwt.verify(
        token,
        sails.config.custom.jwtSecret
      );
      if (!email) {
        return exits.invalidToken({
          error: "Invalid token",
        });
      }
      const user = await User.findOne({ email });
      if (!user) {
        return exits.noUserFound({
          error: "User not found",
        });
      }
      const { id } = user;

      return exits.success(id);
    } catch (err) {
      sails.log.error(err);
      return exits.error({
        error: err.message,
      });
    }
  },
};
