const personSchema = require("./person");

module.exports = {
  type: "object",
  properties: {
    personal: personSchema,
    appointment: { type: "boolean" },
    issue: { type: "string" },
  },
};
