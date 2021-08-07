const statusCode = require("http-status-codes").StatusCodes;
const path = require("path");
const restClient = require("superagent-bluebird-promise");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const bodyParser = require("body-parser");
const PatientsModel = require("./PatientsModel");
const Patient = require("./Patient");
const patientsModel = new PatientsModel(io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 3002;
const KIOSK_API_CALLNUMBER = "http://localhost:3001/callNumber";
const VENUE_ID = "STG-180000001W-83338-SEQRSELFTESTSINGLE-SE";
//TODO: use custom secret
const SECRET = "secretABC";

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

app.post("/submit", (req, res) => {
  const number = patientsModel.addPatient(req.body);
  res.send({ number });
});

io.on("connection", (socket) => {
  socket.emit("patients", { patients: patientsModel.getPatients() });

  socket.on("call number", async (data) => {
    //send HTTP request to server
    let response = await restClient
      .post(KIOSK_API_CALLNUMBER)
      .send({ number: data.number, venueId: VENUE_ID, secret: SECRET })
      .promise();

    if (response.statusCode === statusCode.OK) {
      patientsModel.callNumber(data.number);
      console.log("number called");
    }
  });
});

server.listen(PORT, () =>
  console.log("clinic system simulation listening on port:", PORT)
);
