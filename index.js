const connectToMongo = require("./db");
const express = require("express");
const cors = require('cors');

const app = express();
const port = 5000;

//Middleware
app.use(cors());
app.use(express.json());

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  connectToMongo();
  console.log(`Example app listening on port https://localhost:${port}`);
});
