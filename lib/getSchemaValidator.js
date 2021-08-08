const Ajv = require("ajv");

/**
 * Uses a ajv JSON schema and returns a validator function
 * validator function signature is obj : any => result : { ok : boolean, message : string }
 * @param schema
 * @returns {function(*=): *} validator
 */
function getSchemaValidator(schema) {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  return (obj) =>
    validate(obj)
      ? { ok: true, message: "" }
      : {
          ok: false,
          message: validate.errors
            .map((err) => err.instancePath + " " + err.message)
            .join(", "),
        };
}

module.exports = getSchemaValidator;
