const statusCode = require("http-status-codes").StatusCodes;
const checkNumber = require("../api/checkNumber");

async function checkNumberHandler(req, res) {
  const { venueId, number } = req.params;

  if (!venueId || number === undefined) {
    return res.status(statusCode.BAD_REQUEST).jsonp({
      message: "missing venueId or number",
    });
  }

  let called;
  try {
    called = await checkNumber(number, venueId);
  } catch (e) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).jsonp({
      message: "failed to check number",
    });
  }

  res.status(statusCode.OK).jsonp({ called });
}

module.exports = checkNumberHandler;
