const statusCode = require("http-status-codes").StatusCodes;
const getSchemaValidator = require("../lib/getSchemaValidator");
const callSafeEntry = require("../api/callSafeEntry");

//schema for controller request
const requestSchema = {
  type: "object",
  properties: {
    subType: { type: "string", enum: ["uinfin", "others"] },
    actionType: { type: "string", enum: ["checkin", "checkout"] },
    sub: {
      type: "string",
      oneOf: [
        { pattern: "^[STFG]d{7}[A-Z]$" },
        { pattern: "^[a-zA-Z0-9-]{3,20}$" },
      ],
    },
    venueId: { type: "string" },
    mobileno: { type: "string" },
  },
  required: ["subType", "actionType", "sub", "venueId", "mobileno"],
};

const validate = getSchemaValidator(requestSchema);

/**
 * SafeEntry handler to call Singpass SafeEntry API
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function callSafeEntryHandler(req, res) {
  //validate
  const result = validate(req.body);
  if (!result.ok) {
    return res.status(statusCode.BAD_REQUEST).jsonp({
      message: `invalid request, ${result.message}`,
    });
  }

  //deconstruct body
  const { subType, sub, actionType, venueId, mobileno } = req.body;

  //call safe entry API
  try {
    await callSafeEntry(subType, sub, actionType, venueId, mobileno);
    //respond with CREATED status on success
    res
      .status(statusCode.CREATED)
      .send({ message: `safe entry ${actionType} successful` });
  } catch (e) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .jsonp({ message: `safe entry ${actionType} failed: ${e}` });
  }
}

module.exports = callSafeEntryHandler;
