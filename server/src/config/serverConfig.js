const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const removeHeader = require("../middleware/removeHeader");
const corsConfig = require("./corsConfig");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");

const serverConfig = (app) => {
  app.use(cors(corsConfig));
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static("public"));
  app.use(
    "/api/images",
    express.static(path.join(__dirname, "../public/images"))
  );
  app.use(removeHeader);
  app.use(cookieParser());
};

module.exports = serverConfig;
