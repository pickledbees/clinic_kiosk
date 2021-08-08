const statusCode = require("http-status-codes").StatusCodes;
const getClinicDataFromDB = require("../api/getClinicDataFromDB");

async function serveFormPage(req, res) {
  const venueId = req.query.venueId || req.query.state;

  if (!venueId) {
    return res.status(statusCode.NOT_FOUND).send("page not found");
  }

  try {
    const { clinicName } = await getClinicDataFromDB(venueId);
    res.render("form", { clinicName });
  } catch (e) {
    return res.status(statusCode.NOT_FOUND).send("page not found");
  }
}

module.exports = serveFormPage;
