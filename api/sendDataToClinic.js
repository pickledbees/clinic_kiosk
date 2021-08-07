const restClient = require("superagent-bluebird-promise");
const getClinicDataFromDB = require("./getClinicDataFromDB");

async function sendDataToClinic(data, venueId) {
  let clinicApi;
  try {
    const clinic = await getClinicDataFromDB(venueId);
    clinicApi = clinic.apiUrl;
  } catch (e) {
    console.log(e);
  }

  let response;
  try {
    response = await restClient.post(clinicApi).send(data).promise();
  } catch (e) {
    console.log(e);
  }

  return response.body.number;
}

module.exports = sendDataToClinic;
