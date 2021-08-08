const express = require("express");
const router = express.Router();

const serveFormPage = require("./endpoint/serveFormPage");
const serveQPage = require("./endpoint/serveQPage");
const checkNumberHandler = require("./endpoint/checkNumberHandler");
const getMyInfoEnvHandler = require("./endpoint/getMyInfoEnvHandler");
const getPersonDataHandler = require("./endpoint/getPersonDataHandler");
const submitDataHandler = require("./endpoint/submitDataHandler");
const callSafeEntryHandler = require("./endpoint/callSafeEntryHandler");
const callNumberHandler = require("./endpoint/callNumberHandler");

//Pages
router.get("/form", serveFormPage);
router.get("/callback", serveFormPage);
router.get("/queue", serveQPage);

//Api
router.get("/checkNumber/:venueId/:number", checkNumberHandler);

router.get("/myInfoEnv", getMyInfoEnvHandler);
router.post("/person", getPersonDataHandler);
router.post("/submit", submitDataHandler);
router.post("/safeEntry", callSafeEntryHandler);
router.post("/callNumber", callNumberHandler);

module.exports = router;
