const restClient = require("superagent-bluebird-promise");
const getClinicDataFromDB = require("./getClinicDataFromDB");

/**
 * Based on venueId, send data to the appropriate clinic API and get a Q number
 * Assume clinic handles idempotency of person data sent, hence should retrieve consistent q number unless checked out
 * @param data
 * @param venueId
 * @returns {Promise<number>} q number of person
 */
async function sendDataToClinic(data, venueId) {
  let clinicApi;
  try {
    const clinic = await getClinicDataFromDB(venueId);
    clinicApi = clinic.apiUrl;
  } catch (e) {
    throw new Error(`failed to fetch clinic submission API URL, ${e}`);
  }

  let response;
  try {
    response = await restClient.post(clinicApi).send(data).promise();
  } catch (e) {
    throw new Error(`failed to send data to clinic, ${e}`);
  }

  return response.body.number;
}

module.exports = sendDataToClinic;
