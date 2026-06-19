const complaintRouter = require("express").Router();
const ComplaintController = require("../controllers/complaintController");
const { verifyAccessToken } = require("../middleware/verifyTokens");

complaintRouter
  .get("/", ComplaintController.getAll)
  .get("/:id", ComplaintController.getOne)
  .post("/", verifyAccessToken, ComplaintController.create)
  .put("/:id", verifyAccessToken, ComplaintController.update)
  .delete("/:id", verifyAccessToken, ComplaintController.delete);

module.exports = complaintRouter;
