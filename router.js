const express = require("express");
const router = express.Router();
const path = require("path");
const statusCode = require("http-status-codes").StatusCodes;
const getMyInfoEnvHandler = require("./endpoint/getMyInfoEnvHandler");
const getPersonDataHandler = require("./endpoint/getPersonDataHandler");
const submitDataHandler = require("./endpoint/submitDataHandler");
const callSafeEntryHandler = require("./endpoint/callSafeEntryHandler");
const callNumberHandler = require("./endpoint/callNumberHandler");

//Pages
router.get("/form", (req, res) => {
  let venueId = req.query.venueId;
  if (!venueId) {
    return res.status(statusCode.NOT_FOUND).send("page not found");
  }
  res.sendFile(path.join(__dirname, "public", "pages", "form.html"));
});
router.get("/callback", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "form.html"));
});
router.get("/queue", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "queue.html"));
});

//Api
router.get("/myInfoEnv", getMyInfoEnvHandler);
router.post("/person", getPersonDataHandler);
router.post("/submit", submitDataHandler);
router.post("/safeEntry", callSafeEntryHandler);
router.post("/callNumber", callNumberHandler);

module.exports = router;
