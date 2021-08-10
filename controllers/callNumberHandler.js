const statusCode = require("http-status-codes").StatusCodes;
const getSchemaValidator = require("../lib/getSchemaValidator");
const getClinicDataFromDB = require("../api/getClinicDataFromDB");

//schema for controller request
const requestSchema = {
  type: "object",
  properties: {
    number: { type: "integer" },
    venueId: { type: "string" },
    lastCalled: {
      type: "array",
      items: {
        type: "object",
        properties: {
          number: { type: "integer" },
          time: { type: "integer" },
        },
      },
    },
    secret: { type: "string" },
  },
  required: ["number", "venueId", "secret", "lastCalled"],
};

const validate = getSchemaValidator(requestSchema);

/**
 * Handler for Number Call API. Clinics call this API to call a number
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function callNumberHandler(req, res) {
  //validate
  const result = validate(req.body);
  if (!result.ok) {
    return res.status(statusCode.BAD_REQUEST).jsonp({
      message: `invalid request, ${result.message}`,
    });
  }

  //deconstruct body
  const { number, venueId, secret, lastCalled } = req.body;

  //get clinic secret from DB to verify with secret submitted
  let clinicSecret;
  try {
    const clinic = await getClinicDataFromDB(venueId);
    clinicSecret = clinic.secret;
  } catch (e) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .jsonp({ message: "failed to validate number call" });
  }

  //validate secret
  if (secret !== clinicSecret) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .jsonp({ message: "cannot call number, unauthorised request" });
  }

  //notify subscribed clients in relevant venueId
  const data = { number, lastCalled };
  req.io.in(venueId).emit("number called", data);

  //send back response to clinic
  res.status(statusCode.OK).send();
}

module.exports = callNumberHandler;
