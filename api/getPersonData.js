const restClient = require("superagent-bluebird-promise");
const statusCode = require("http-status-codes").StatusCodes;
const security = require("../lib/security");

//collect required constants from environment variables
const API_URL_TOKEN = process.env.MYINFO_API_TOKEN;
const REDIRECT_URL = process.env.MYINFO_APP_REDIRECT_URL;
const API_URL_PERSON = process.env.MYINFO_API_PERSON;
const CLIENT_ID = process.env.MYINFO_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.MYINFO_APP_CLIENT_SECRET;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_CERT = process.env.PUBLIC_CERT;
const ATTRIBUTES = process.env.MYINFO_ATTRIBUTES;

/**
 * Calls MyInfo Person API to retrieve person data.
 * 1. Uses auth code to get token
 * 2. Verifies and decodes token
 * 3. Calls Person API with data (sub) from decoded token
 * 4. Decrypts and verifies returned JWS to obtain person data
 * @param authCode
 * @returns {Promise<*>} resolves to MyInfo person data json
 */
async function getPersonData(authCode) {
  let token = await getToken(authCode);
  return await callPersonApi(token);
}

/**
 * Calls the MyInfo token API to get token given an authorization code
 * @param authCode
 * @returns {Promise<*>}
 */
async function getToken(authCode) {
  //construct params
  let params = {
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: REDIRECT_URL,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  };

  //construct headers
  let authHeaders = security.generateSHA256withRSAHeader(
    API_URL_TOKEN,
    params,
    "POST",
    CLIENT_ID,
    PRIVATE_KEY,
    CLIENT_SECRET
  );

  let headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Cache-Control": "no-cache",
    Authorization: authHeaders,
  };

  //perform call to get token
  let response;
  try {
    response = await restClient
      .post(API_URL_TOKEN)
      .set(headers)
      .send(params)
      .promise();
  } catch (e) {
    throw new Error("failed to fetch token from MyInfo token API");
  }

  if (response.statusCode === statusCode.OK) {
    return response.body["access_token"];
  } else {
    throw new Error("failed to fetch token");
  }
}

/**
 * Calls the MyInfo Person API to get person data given a valid token
 * @param token
 * @returns {Promise<*>}
 */
async function callPersonApi(token) {
  //verify JWS
  let decoded;
  try {
    decoded = security.verifyJWS(token, PUBLIC_CERT);
  } catch (e) {
    throw new Error("failed to verify token");
  }

  if (!decoded) throw new Error("invalid token");
  let sub = decoded.sub;
  if (!sub) throw new Error("sub not found");

  //call person API to get person data
  let response;
  try {
    response = await createPersonRequest(sub, token).promise();
  } catch (e) {
    throw new Error("failed to fetch person data");
  }

  let encryptedPersonData = response.text;

  //decrypt the JWE returned from the response
  let personDataJWS;
  try {
    personDataJWS = await security.decryptJWE(encryptedPersonData, PRIVATE_KEY);
  } catch (e) {
    throw new Error("failed to decrypt person data");
  }

  //verify and decode the JWS
  let personData;
  try {
    personData = await security.verifyJWS(personDataJWS, PUBLIC_CERT);
  } catch (e) {
    throw new Error("invalid data or signature for person data");
  }

  return personData;
}

function createPersonRequest(sub, token) {
  let url = `${API_URL_PERSON}/${sub}/`;
  let params = {
    client_id: CLIENT_ID,
    attributes: ATTRIBUTES,
  };
  let authHeaders = security.generateSHA256withRSAHeader(
    url,
    params,
    "GET",
    CLIENT_ID,
    PRIVATE_KEY,
    CLIENT_SECRET
  );
  let headers = {
    "cache-control": "no-cache",
    authorization: `${authHeaders},Bearer ${token}`,
  };
  return restClient.get(url).set(headers).query(params).buffer(true);
}

module.exports = getPersonData;
