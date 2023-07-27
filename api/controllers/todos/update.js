module.exports = {
  friendlyName: "Update",

  description: "Update todos.",

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
      statusCode: 200,
      description: "Todo updated successfully",
    },
    notFound: {
      statusCode: 404,
      description: "Todo not found",
    },
  },

  fn: async function (inputs, exits) {
    try {
      // All done.
      const userId = await sails.helpers.getUserFromToken(
        this.req.session.authToken
      );
      const todoId = this.req.params.id;
      console.log(todoId);
      const todo = await Todo.findOne({ id: todoId, todoCreatedBy: userId });
      if (!todo) {
        return exits.notFound({
          error: "Todo not found",
        });
      }
      const updatedTodo = await Todo.updateOne({
        id: todoId,
        todoCreatedBy: userId,
      }).set({
        todoTitle: inputs.title,
        todoDescription: inputs.description,
        todoStatus: inputs.status,
      });
      return exits.success({
        message: "Todo updated successfully",
        data: updatedTodo,
      });
    } catch (err) {
      sails.log.error(err);
      return exits.error({
        error: err.message,
      });
    }
  },
};
