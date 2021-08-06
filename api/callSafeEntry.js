const restClient = require("superagent-bluebird-promise");
const statusCode = require("http-status-codes").StatusCodes;
const security = require("../lib/security");

const API_URL_SAFE_ENTRY = process.env.SAFEENTRY_API;
const CLIENT_ID = process.env.SAFEENTRY_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.SAFEENTRY_APP_CLIENT_SECRET;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_CERT = process.env.PUBLIC_CERT;

async function callSafeEntry(subType, sub, actionType, venueId, mobileNo) {
  let data = {
    subType,
    sub,
    actionType,
    venueId,
    mobileno: mobileNo,
  };

  let params = {};
  params.jose = await security.encryptDataIntoCompactJWE(
    PUBLIC_CERT,
    JSON.stringify(data)
  );

  let urlObj = new URL(API_URL_SAFE_ENTRY);
  let authHeaders = await security.generateSHA256withRSAHeader(
    urlObj.origin + urlObj.pathname,
    params,
    "POST",
    CLIENT_ID,
    PRIVATE_KEY,
    CLIENT_SECRET
  );

  let headers = {
    "content-type": "application/jose",
    authorization: authHeaders,
  };

  let response;
  try {
    response = await restClient
      .post(API_URL_SAFE_ENTRY)
      .set(headers)
      .send(params.jose)
      .promise();
  } catch (e) {
    throw new Error("failed to call safe entry api: " + e.body.message);
  }

  if (response.statusCode === statusCode.CREATED) {
    return true;
  } else {
    throw new Error("invalid call to safe entry api: " + response.body.message);
  }
}

module.exports = callSafeEntry;
