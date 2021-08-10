const statusCode = require("http-status-codes").StatusCodes;
const getSchemaValidator = require("../lib/getSchemaValidator");
const getPersonData = require("../api/getPersonData");

//schema for controller request
const requestSchema = {
  type: "object",
  properties: {
    authCode: { type: "string" },
  },
  required: ["authCode"],
};

const validate = getSchemaValidator(requestSchema);

/**
 * Handler to get person data from MyInfo Person API given an authorisation code obtained from Singpass
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
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

  //call MyInfo Person API
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
