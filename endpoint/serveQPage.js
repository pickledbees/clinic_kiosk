const statusCode = require("http-status-codes").StatusCodes;
const getClinicDataFromDB = require("../api/getClinicDataFromDB");

async function serveQPage(req, res) {
  const number = req.query.number;
  const venueId = req.query.venueId;

  if (number === undefined || !venueId) {
    return res.status(statusCode.NOT_FOUND).send("page not found");
  }

  try {
    const { clinicName } = await getClinicDataFromDB(venueId);
    res.render("queue", { clinicName, number });
  } catch (e) {
    return res.status(statusCode.NOT_FOUND).send("page not found");
  }
}

module.exports = serveQPage;
