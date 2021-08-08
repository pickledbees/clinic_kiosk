const statusCode = require("http-status-codes").StatusCodes;

function getMyInfoEnvHandler(req, res) {
  const clientId = process.env.MYINFO_APP_CLIENT_ID;
  const redirectUrl = process.env.MYINFO_APP_REDIRECT_URL;
  const authApiUrl = process.env.MYINFO_API_AUTHORISE;
  const attributes = process.env.MYINFO_ATTRIBUTES;

  if (!clientId || !redirectUrl || !authApiUrl || !attributes) {
    res.status(statusCode.NOT_FOUND).jsonp({
      message: "application environment variables not completely set",
    });
  }

  res.status(statusCode.OK).jsonp({
    clientId,
    redirectUrl,
    authApiUrl,
    attributes,
  });
}

module.exports = getMyInfoEnvHandler;
