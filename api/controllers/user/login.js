module.exports = {
  friendlyName: "Login",

  description: "Login user.",

  inputs: {
    email: {
      type: "string",
      required: true,
    },
    password: {
      type: "string",
      required: true,
    },
  },

  exits: {
    success: {
      description: "Login Succesfully",
    },
    notAUser: {
      statusCode: 404,
      description: "User not found",
    },
    passwordMismatch: {
      statusCode: 401,
      description: "Password do not match",
    },
    operationalError: {
      statusCode: 400,
      description: "Something went wrong",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const user = await User.findOne({ email: inputs.email });

      if (!user) {
        return exits.notAUser({
          error: `${inputs.email} is not found`,
        });
      }
      await sails.helpers.passwords
        .checkPassword(inputs.password, user.password)
        .intercept("incorrect", (error) => {
          exits.passwordMismatch({
            error: error.message,
          });
        });
      const token = await sails.helpers.generateNewJwtToken(user.email);
      this.req.session.authToken = token;
      this.req.me = user;
      return exits.success({
        message: `${user.email} is logged in`,
        data: user,
        token,
      });
    } catch (err) {
      sails.log.error(err);
      if (err.isOperational) {
        return exits.operationalError({
          message: `Error logging in user ${inputs.email}`,
          error: err.raw,
        });
      }
      return exits.error({
        message: `Error logging in user ${inputs.email}`,
        error: err.message,
      });
    }
  },
};
