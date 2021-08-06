async function sendDataToClinic(data, venueId) {
  let clinicApi = await getClinicSubmitApi(venueId);
  //submit data to clinic
  return 2;
}

async function getClinicSubmitApi(venueId) {
  //fetch url from db based on venueId
  return "http://localhost:3002/submit";
}

module.exports = sendDataToClinic;
