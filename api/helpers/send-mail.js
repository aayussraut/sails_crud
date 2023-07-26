const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

module.exports = {
  friendlyName: "Send mail",

  description: "",

  inputs: {
    options: {
      type: "ref",
      required: true,
    },
  },

  exits: {
    success: {
      description: "All done.",
    },
  },

  fn: async function (inputs) {
    console.log(sails.config.custom.gmailEmail);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: sails.config.custom.gmailEmail,
        pass: sails.config.custom.gmailPassword,
      },
    });
    transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extName: ".hbs",
          partialsDir: "./views",
          layoutsDir: "./views",
          defaultLayout: "",
        },
        viewPath: "./views",
        extName: ".hbs",
      })
    );
    try {
      let emailOptions = {
        from: "Optimum Futurist<smth@optimum.com>",
        ...inputs.options,
      };
      console.log(emailOptions);
      await transporter.sendMail(emailOptions);
    } catch (error) {
      sails.log(error);
    }
  },
};
