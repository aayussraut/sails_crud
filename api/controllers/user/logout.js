module.exports = {
  friendlyName: "Logout",

  description: "Logout user.",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    this.req.session.destroy();
    if (exits.success) {
      return exits.success({ message: "User logged out successfully" });
    }
    return exits.error({ message: "Something went wrong" });
  },
};
