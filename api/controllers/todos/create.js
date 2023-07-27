module.exports = {
  friendlyName: "Create",

  description: "Create todo.",

  inputs: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    status: {
      type: "string",
      isIn: ["pending", "completed"],
    },
  },

  exits: {
    success: {
      statusCode: 201,
      description: "Todo created successfully",
    },
    operationalError: {
      statusCode: 400,
      description: "Something went wrong",
    },
  },

  fn: async function (inputs, exits) {
    const token = this.req.session.authToken;
    const createdBy = await sails.helpers.getUserFromToken(token);
    try {
      const todo = await Todo.create({
        todoTitle: inputs.title,
        todoDescription: inputs.description,
        todoStatus: inputs.status,
        todoCreatedBy: createdBy,
      }).fetch();
      return exits.success({
        message: "Todo created successfully",
        data: todo,
      });
    } catch (error) {
      sails.log.error(error);
      return exits.operationalError({
        error: error.message,
      });
    }
  },
};
