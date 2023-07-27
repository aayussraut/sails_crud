module.exports = {
  friendlyName: "Get",

  description: "Get todos.",

  inputs: {},

  exits: {},

  fn: async function (inputs) {
    const id = await sails.helpers.getUserFromToken(this.req.session.authToken);
    const todos = await Todo.find({ todoCreatedBy: id });
    return todos;
  },
};
