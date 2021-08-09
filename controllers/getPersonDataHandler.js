const statusCode = require("http-status-codes").StatusCodes;
const getSchemaValidator = require("../lib/getSchemaValidator");
const getPersonData = require("../api/getPersonData");

const requestSchema = {
  type: "object",
  properties: {
    authCode: { type: "string" },
  },
  required: ["authCode"],
};

const validate = getSchemaValidator(requestSchema);

async function getPersonDataHandler(req, res) {
  //validate request
  const result = validate(req.body);
  if (!result.ok) {
    return res.status(statusCode.BAD_REQUEST).jsonp({
      message: `invalid request, ${result.message}`,
    });
  }

  //deconstruct body
  const { authCode } = req.body;

  //attempt get person data call
  try {
    let personData = await getPersonData(authCode);
    res.status(statusCode.OK).jsonp(personData);
  } catch (e) {
    res
      .status(statusCode.NOT_FOUND)
      .jsonp({ message: `could not get person data, ${e}` });
  }
}

module.exports = getPersonDataHandler;
