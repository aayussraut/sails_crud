module.exports = {
  friendlyName: "Register",

  description: "Register user.",

  inputs: {
    fullName: {
      type: "string",
      required: true,
    },
    email: {
      type: "string",
      required: true,
      isEmail: true,
      unique: true,
    },
    password: {
      type: "string",
      required: true,
      minLength: 6,
    },
  },

  exits: {
    success: {
      statusCode: 201,
      description: "New user account was created",
    },
    emailAlreadyInUse: {
      statusCode: 400,
      description: "Email address already in use",
    },
    error: {
      description: "Something went wrong",
    },
  },

  fn: async function (inputs, exit) {
    try {
      const newEmailAddress = inputs.email.toLowerCase();
      const token = await sails.helpers.strings.random("url-friendly");
      let newUser = await User.create({
        fullName: inputs.fullName,
        email: newEmailAddress,
        password: inputs.password,
        emailProofToken: token,
        emailProofTokenExpiresAt:
          Date.now() + sails.config.custom.emailProofTokenTTL,
      }).fetch();
      const confirmLink = `${sails.config.custom.baseUrl}/user/confirm?token=${token}`;
      const email = {
        to: newUser.email,
        subject: "Confirm Your account",
        template: "confirm",
        context: {
          name: newUser.fullName,
          confirmLink: confirmLink,
        },
      };
      await sails.helpers.sendMail(email);
    } catch (err) {
      console.log(err);
    }

    return;
  },
};
