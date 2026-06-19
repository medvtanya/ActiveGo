
const UserSportRouter = require("express").Router();
const UserSportController = require("../controllers/userSportController");

UserSportRouter
  .get("/", UserSportController.getAll)
  .post("/", UserSportController.create)
  .get("/:id", UserSportController.getOne)
  .put("/:id", UserSportController.update)
  .delete("/:id", UserSportController.delete);

module.exports = UserSportRouter;
