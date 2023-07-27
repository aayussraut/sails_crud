module.exports = {
  friendlyName: "Delete",

  description: "Delete todos.",

  inputs: {
    // id: {
    //   type: "number",
    //   required: true,
    // },
  },

  exits: {
    success: {
      statusCode: 200,
      description: "Todo deleted successfully",
    },
    notFound: {
      statusCode: 404,
      description: "Todo not found",
    },
  },

  fn: async function (inputs, exits) {
    try {
      const userId = await sails.helpers.getUserFromToken(
        this.req.session.authToken
      );

      const todoId = this.req.params.id;

      const todo = await Todo.findOne({ id: todoId, todoCreatedBy: userId });
      if (!todo) {
        return exits.notFound({
          error: "Todo not found",
        });
      }
      await Todo.destroyOne({ id: todoId, todoCreatedBy: userId });
      return exits.success({
        message: "Todo deleted successfully",
      });
    } catch (err) {
      sails.log.error(err);
      return exits.error({
        error: err.message,
      });
    }
  },
};
