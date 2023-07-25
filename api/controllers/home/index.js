module.exports = {
  friendlyName: "Index",

  description: "Index home.",

  inputs: {},

  exits: {},

  fn: async function (inputs, exits) {
    // All done.
    exits.success({ message: "Welcome to the todoApp API" });
  },
};
