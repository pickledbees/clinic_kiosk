const restClient = require("superagent-bluebird-promise");
const getClinicDataFromDB = require("./getClinicDataFromDB");

/**
 * Checks status of an nric and number pair for a given venue (clinic)
 * @param venueId
 * @param nric
 * @param number
 * @returns {Promise<*>} response object of clinic checkStatus API
 * response object format is { status: number, lastCalled: Array<{ number: number, time: number }> }
 */
async function checkStatus(venueId, nric, number) {
  let apiUrl;
  try {
    const clinic = await getClinicDataFromDB(venueId);
    apiUrl = clinic.checkStatusApiUrl;
  } catch (e) {
    throw new Error(`failed to fetch clinic check status API URL, ${e}`);
  }

  let response;
  try {
    response = await restClient.get(`${apiUrl}/${nric}/${number}`).promise();
  } catch (e) {
    throw new Error(`failed to check status from clinic, ${e}`);
  }

  return response.body;
}

module.exports = checkStatus;
