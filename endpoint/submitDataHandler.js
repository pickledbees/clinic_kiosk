const statusCode = require("http-status-codes").StatusCodes;
const getSchemaValidator = require("../lib/getSchemaValidator");
const sendDataToClinic = require("../api/sendDataToClinic");

//TODO: complete schema when form is complete
const requestSchema = {
  type: "object",
  properties: {
    venueId: { type: "string" },
    nric: {
      type: "string",
      oneOf: [
        { pattern: "^[STFG]d{7}[A-Z]$" },
        { pattern: "^[a-zA-Z0-9-]{3,20}$" },
      ],
    },
    name: { type: "string" },
    mobileno: { type: "string" },
    sex: { type: "string" },
    race: { type: "string" },
    nationality: { type: "string" },
    dob: { type: "string" },
    email: { type: "string" },
    regadd: { type: "string" },
  },
  required: [
    "venueId",
    "nric",
    "name",
    "mobileno",
    "sex",
    "race",
    "nationality",
    "dob",
    "email",
    "regadd",
  ],
};

const validate = getSchemaValidator(requestSchema);

async function submitDataHandler(req, res) {
  //validate
  const result = validate(req.body);
  if (!result.ok) {
    return res.status(statusCode.BAD_REQUEST).jsonp({
      message: `invalid request, ${result.message}`,
    });
  }

  //deconstruct body
  const { venueId, ...personData } = req.body;

  //send person data to clinic and get the Q number
  let number;
  try {
    number = await sendDataToClinic(personData, venueId);
  } catch (e) {
    return res.status(
      statusCode.INTERNAL_SERVER_ERROR,
      "failed to submit person data"
    );
  }
  const { nric, mobileno } = personData;

  res
    .status(statusCode.OK)
    .jsonp({ redirect: "/queue", nric, mobileno, number, venueId });
}

module.exports = submitDataHandler;
