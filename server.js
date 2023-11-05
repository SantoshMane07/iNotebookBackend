const connectToMongo = require("./db");
const express = require("express");
const cors = require('cors');
const path = require('path');

const app = express();
const port = 8080;

//Middleware
app.use(cors());
app.use(express.json());

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use('/.well-known/acme-challenge', express.static(path.join(__dirname, '.well-known/acme-challenge')));

app.listen(port, () => {
  connectToMongo();
  console.log(`App listening on port https://localhost:${port}`);
});
