const restClient = require("superagent-bluebird-promise");
const getClinicDataFromDB = require("./getClinicDataFromDB");

/**
 * Check if a clinic has called a number
 * @param number
 * @param venueId
 * @returns {Promise<PatientsModel.called>}
 */
async function checkNumber(number, venueId) {
  let apiUrl;
  try {
    const clinic = await getClinicDataFromDB(venueId);
    apiUrl = clinic.checkNumberApiUrl;
  } catch (e) {
    throw new Error(`failed to fetch clinic check number API URL, ${e}`);
  }

  let response;
  try {
    response = await restClient.get(`${apiUrl}/${number}`).promise();
  } catch (e) {
    throw new Error(`failed to check number from clinic, ${e}`);
  }

  return response.body.called;
}

module.exports = checkNumber;
