const express = require("express");
const router = express.Router();
const path = require("path");
const endpoint = require("./endpoint");

//Pages
router.get("/form", endpoint.serveForm);
router.get("/queue", endpoint.serveQPage);
router.get("/callback", endpoint.callbackHandler);

//Api
router.get("/myInfoEnv", endpoint.getMyInfoEnvHandler);
router.post("/person", endpoint.getPersonDataHandler);
router.post("/submit", endpoint.submitDataHandler);
router.post("/safeEntry", endpoint.callSafeEntryHandler);
router.post("/callNumber", endpoint.callNumberHandler);

module.exports = router;
