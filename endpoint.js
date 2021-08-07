const statusCode = require("http-status-codes").StatusCodes;
const getPersonData = require("./api/getPersonData");
const callSafeEntry = require("./api/callSafeEntry");
const sendDataToClinic = require("./api/sendDataToClinic");
const getClinicDataFromDB = require("./api/getClinicDataFromDB");

function serveForm(req, res) {
  let venueId = req.query.venue_id;
  if (venueId) {
    req.session.venueId = venueId;
    res.render("form");
  } else {
    res.status(statusCode.NOT_FOUND).send("page not found");
  }
}

function serveQPage(req, res) {
  //extract session params
  let { nric, venueId, mobileno, qNumber } = req.session;

  // //delete later
  // nric = "S9601403A";
  // venueId = "STG-180000001W-83338-SEQRSELFTESTSINGLE-SE";
  // mobileno = "12345678";
  // qNumber = 10;

  res.render("queue", { data: { nric, venueId, mobileno, qNumber } });
}

function callbackHandler(req, res) {
  res.render("form");
}

function getMyInfoEnvHandler(req, res) {
  res.status(statusCode.OK).jsonp({
    clientId: process.env.MYINFO_APP_CLIENT_ID,
    redirectUrl: process.env.MYINFO_APP_REDIRECT_URL,
    authApiUrl: process.env.MYINFO_API_AUTHORISE,
    attributes: process.env.MYINFO_ATTRIBUTES,
  });
}

async function getPersonDataHandler(req, res) {
  //extract params from body
  const { authCode } = req.body;

  //verify body
  if (!authCode) {
    return sendError(res, statusCode.BAD_REQUEST, "missing authorization code");
  }

  //call api
  try {
    let data = await getPersonData(authCode);
    res.status(statusCode.OK).jsonp(data);
  } catch (e) {
    return sendError(res, statusCode.NOT_FOUND, "person data not found: " + e);
  }
}

let allowedActions = new Set(["checkin", "checkout"]);
async function callSafeEntryHandler(req, res) {
  //extract params from body
  let { subType, sub, actionType, venueId, mobileno } = req.body;

  //verify params
  if (!subType || !sub || !actionType || !venueId || !mobileno) {
    return sendError(
      res,
      statusCode.BAD_REQUEST,
      "safe entry call must have subType, sub, actionType, venueId and moileno"
    );
  }

  if (!allowedActions.has(actionType)) {
    return sendError(
      res,
      statusCode.BAD_REQUEST,
      "actionType value must be 'checkin' or 'checkout'"
    );
  }

  try {
    await callSafeEntry(subType, sub, actionType, venueId, mobileno);
    res
      .status(statusCode.CREATED)
      .send({ message: `safe entry ${actionType} successful` });
  } catch (e) {
    return sendError(
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      `safe entry ${actionType} failed: ${e}`
    );
  }
}

//TODO: complete
async function submitDataHandler(req, res) {
  //verify this came from a valid session
  const venueId = req.session.venueId;
  if (!venueId) {
    //some error
    sendError(
      res,
      statusCode.BAD_REQUEST,
      "form submission from unknown venue"
    );
    return;
  }

  //get url from db
  let qNumber;
  try {
    //submit and get q number
    qNumber = await sendDataToClinic(req.body, venueId);
  } catch (e) {
    return sendError(
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      "failed to submit data"
    );
  }

  req.session.nric = req.body.nric;
  req.session.mobileno = req.body.mobileno;
  req.session.qNumber = qNumber;
  res.status(statusCode.OK).jsonp({ redirect: "/queue" });
}

//for clinic queue system to call
async function callNumberHandler(req, res) {
  const { number, venueId, secret } = req.body;

  let clinicSecret;
  try {
    const clinic = await getClinicDataFromDB(venueId);
    clinicSecret = clinic.secret;
  } catch (e) {
    return sendError(
      res,
      statusCode.INTERNAL_SERVER_ERROR,
      "failed to validate number call"
    );
  }

  if (secret !== clinicSecret) {
    return sendError(
      res,
      statusCode.UNAUTHORIZED,
      "cannot call number, unauthorised request"
    );
  }

  if (number === undefined || !venueId) {
    return sendError(res, statusCode.BAD_REQUEST, "invalid number or venueId");
  }

  const data = { number, venueId };
  req.io.emit("callNumber", data);
  res.status(statusCode.OK).send();
}

function sendError(res, code, message) {
  res.status(code).jsonp({ message });
}

module.exports = {
  serveForm,
  serveQPage,
  callbackHandler,
  getMyInfoEnvHandler,
  getPersonDataHandler,
  callSafeEntryHandler,
  submitDataHandler,
  callNumberHandler,
};
