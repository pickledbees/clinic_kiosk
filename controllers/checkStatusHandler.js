const statusCode = require("http-status-codes").StatusCodes;
const checkStatus = require("../api/checkStatus");

async function checkStatusHandler(req, res) {
  const { venueId, nric, number } = req.params;

  if (!venueId || !nric || !number) {
    return res.status(statusCode.BAD_REQUEST).jsonp({
      message: "missing venueId or number",
    });
  }

  let response;
  try {
    response = await checkStatus(venueId, nric, number);
  } catch (e) {
    console.error(e);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).jsonp({
      message: "failed to check status",
    });
  }

  res.status(statusCode.OK).jsonp(response);
}

module.exports = checkStatusHandler;
