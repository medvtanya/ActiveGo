
const sportRouter = require("express").Router();
const SportController = require("../controllers/sportConctroller");

sportRouter
  .get("/", SportController.getAll)
  .post("/", SportController.create)
  .get("/:id", SportController.getOne)
  .put("/:id", SportController.update)
  .delete("/:id", SportController.delete);

module.exports = sportRouter;
