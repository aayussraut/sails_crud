/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  tableName: "users", // define table name
  attributes: {
    // attributes of table users
    fullName: {
      type: "string",
      required: true,
      columnName: "full_name",
    },
    email: {
      type: "string",
      required: true,
      unique: true,
    },
    emailStatus: {
      type: "string",
      isIn: ["unconfirmed", "confirmed"],
      defaultsTo: "unconfirmed",
      columnName: "email_status",
    },
    emailProofToken: {
      type: "string",
      description: "This will be used to confirm user email",
      columnName: "email_proof_token",
    },
    emailProofTokenExpiresAt: {
      type: "number",
      description:
        "time in milliseconds representing when the emailProofToken will expire",
      columnName: "email_proof_token_expires_at",
    },
    password: {
      type: "string",
      required: true,
    },
    passwordResetToken: {
      type: "string",
      description: "This will be used to reset password",
      columnName: "password_reset_token",
    },
    passwordResetTokenExpiresAt: {
      type: "number",
      description:
        "time in milliseconds representing when the passwordResetToken will expire",
      columnName: "password_reset_token_expires_at",
      example: 123456789,
    },
    todos: {
      collection: "todo",
      via: "todoCreatedBy",
    },
  },
  beforeCreate: async function (values, next) {
    // this function will be called before creating a record
    // here we will hash the password
    const hashedPassword = await sails.helpers.passwords.hashPassword(
      values.password
    );
    values.password = hashedPassword;
    return next();
  },
  customToJSON: function () {
    // this function will be called when you are returning a record as a response
    return _.omit(this, ["password"]); // omit password field from response
  },
};
