require("dotenv").config();
module.exports = {
  origin: [
    process.env.CLIENT_URL,
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://localhost:5173",
    "http://localhost:5174",
  ].filter(Boolean),
  optionsSuccessStatus: 200,
  credentials: true,
};
