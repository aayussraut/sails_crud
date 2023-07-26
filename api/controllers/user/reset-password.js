module.exports = {
  friendlyName: "Reset password",

  description: "",

  inputs: {
    password: {
      type: "string",
      description: "The new, unencrypted password.",
      required: true,
    },
    token: {
      type: "string",
      description: "The password reset token from the email.",
      required: true,
    },
  },

  exits: {
    success: {
      description: "Password has been reset successfully",
    },
    invalidToken: {
      statusCode: 401,
      description: "Invalid token provided",
    },
  },

  fn: async function (inputs, exits) {
    // All done.
    if (!inputs.token) {
      return exits.invalidToken({
        error: "Invalid token provided",
      });
    }

    var user = await User.findOne({ passwordResetToken: inputs.token });
    if (!user || user.passwordResetTokenExpiresAt <= Date.now()) {
      return exits.invalidToken({
        error: "Your token is expired, invalid, or already used up.",
      });
    }
    const hashedPassword = await sails.helpers.passwords.hashPassword(
      inputs.password
    );

    await User.updateOne({ id: user.id }).set({
      password: hashedPassword,
      passwordResetToken: "",
      passwordResetTokenExpiresAt: 0,
    });

    const token = await sails.helpers.generateNewJwtToken(user.email);
    this.req.user = user;
    return exits.success({
      message: "Password has been reset successfully",
      data: user,
      token,
    });
  },
};
