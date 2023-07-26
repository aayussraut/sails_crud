module.exports = {
  friendlyName: "Forgot password",

  description: "",

  inputs: {
    email: {
      description: "The email of the user to send the password reset link",
      type: "string",
      required: true,
    },
  },

  exits: {
    sucess: {
      description: "A recovery email has been sent to your email address",
    },
  },

  fn: async function (inputs, exits) {
    // All done.
    var user = await User.findOne({ email: inputs.email });

    if (!user) {
      return;
    }

    const token = await sails.helpers.strings.random("url-friendly");

    await User.update({ id: user.id }).set({
      passwordResetToken: token,
      passwordResetTokenExpiresAt:
        Date.now() + sails.config.custom.passwordResetTokenTTL,
    });

    const recoverLink = `${sails.config.custom.baseUrl}/user/reset-password?token=${token}`;

    const emailInfo = {
      to: user.email,
      subject: "Reset Password",
      template: "forgot-password",
      context: {
        name: user.fullName,
        recoverLink: recoverLink,
      },
    };
    try {
      await sails.helpers.sendMail(emailInfo);
    } catch (error) {
      sails.log(error);
    }
    return exits.sucess({
      message: "A recovery email has been sent to your email address",
    });
  },
};
