const statusCode = require("http-status-codes").StatusCodes;
const getClinicDataFromDB = require("../api/getClinicDataFromDB");

/**
 * Handler for serving the Queue Page after successful registration
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function serveQPage(req, res) {
  //get query params
  const number = req.query.number;
  const venueId = req.query.venueId;

  //verify params
  if (number === undefined || !venueId) {
    return res.status(statusCode.NOT_FOUND).send("page not found");
  }

  try {
    //try to get clinic name given the venueId
    const { clinicName } = await getClinicDataFromDB(venueId);

    //if clinicName exists, send page
    res.render("queue", { clinicName, number });
  } catch (e) {
    return res.status(statusCode.NOT_FOUND).send("page not found");
  }
}

module.exports = serveQPage;
