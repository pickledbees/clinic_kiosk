const statusCode = require("http-status-codes").StatusCodes;
const checkStatus = require("../api/checkStatus");

/**
 * Status check handler to call clinic status check API based on nric and queue number.
 * venueId must be provided to send to correct clinic server
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
async function checkStatusHandler(req, res) {
  //get params
  const { venueId, nric, number } = req.params;

  //verify request params
  if (!venueId || !nric || !number) {
    return res.status(statusCode.BAD_REQUEST).jsonp({
      message: "missing venueId or number",
    });
  }

  //call API
  let response;
  try {
    response = await checkStatus(venueId, nric, number);
  } catch (e) {
    console.error(e);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).jsonp({
      message: "failed to check status",
    });
  }

  //respond with OK if successful
  res.status(statusCode.OK).jsonp(response);
}

module.exports = checkStatusHandler;
