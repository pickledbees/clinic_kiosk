const statusCode = require("http-status-codes").StatusCodes;
const getClinicDataFromDB = require("../api/getClinicDataFromDB");

/**
 * Handler to serve the initial registration Form Page after scanning QR code at clinic
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function serveFormPage(req, res) {
  //extract request params
  const venueId = req.query.venueId || req.query.state;

  //verify venueId
  if (!venueId) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send("page not found, invalid venue");
  }

  try {
    //try to get clinic name given the venueId
    const { clinicName } = await getClinicDataFromDB(venueId);

    //if clinicName exists, send page
    res.render("form", { clinicName });
  } catch (e) {
    return res.status(statusCode.NOT_FOUND).send("page not found, " + e);
  }
}

module.exports = serveFormPage;
