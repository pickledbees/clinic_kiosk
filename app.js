const fs = require("fs");
require("./loadConfig");

process.env.PUBLIC_CERT = fs.readFileSync(process.env.PUBLIC_CERT_PATH, "utf8");
process.env.PRIVATE_KEY = fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8");

//util imports
const path = require("path");

//TODO: maybe convert to https
//server imports
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

//middleware and routing imports
const router = require("./routes");
const bodyParser = require("body-parser");

//view engine setup
app.set("view engine", "ejs");

//set middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//mount io for broadcasting later
app.use((req, res, next) => {
  req.io = io;
  next();
});

//mount router
app.use("/", router);

//listen
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`app listening on ${PORT}...`);
});
