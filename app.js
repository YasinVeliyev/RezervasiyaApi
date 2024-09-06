require("dotenv").config();

const express = require("express");
const http = require("node:http");
const mongoose = require("mongoose");

const authRouter = require("./routes/authRouter");
const { errorHandler } = require("./utils");

app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

app.use(errorHandler);

const server = http.createServer(app);

const PORT = process.env["PORT"];
let DATABASE_URI;

if ((process.env["NODE_ENV"] = "test")) {
  DATABASE_URI = process.env["DATABASE_TEST_URI"];
} else if ((process.env["NODE_ENV"] = "development")) {
  DATABASE_URI = process.env["DATABASE_DEV_URI"];
} else {
  DATABASE_URI = process.env["DATABASE_TEST_URI"];
}
console.log(DATABASE_URI);
mongoose
  .connect(DATABASE_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    server.close(() => {
      console.info("Server is closing");
      process.exit();
    });

    console.error(err);
  });
