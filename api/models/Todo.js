/**
 * Todo.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "todos",
  attributes: {
    todoTitle: {
      type: "string",
      required: true,
      columnName: "todo_title",
    },
    todoDescription: {
      type: "string",
      required: true,
      columnName: "todo_description",
    },
    todoStatus: {
      type: "string",
      isIn: ["pending", "completed"],
      defaultsTo: "pending",
      columnName: "todo_status",
    },
    todoCreatedBy: {
      model: "user",
    },
  },
};
