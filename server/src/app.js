const express = require("express");
const serverConfig = require("./config/serverConfig");
const indexRouter = require("./routes/index.routes");

const http = require("http");
const { setupWebsockets } = require("./config/websocketConfig");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
serverConfig(app);

app.use("/api", indexRouter);
const server = http.createServer(app);
setupWebsockets(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
