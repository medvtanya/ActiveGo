const sportClubMemberesRouter = require("express").Router();
const SportClubMemberesController = require("../controllers/sportClubMemberes.controller");

sportClubMemberesRouter
  .get("/", SportClubMemberesController.getAll)
  .get("/:id", SportClubMemberesController.getById)
  .post("/", SportClubMemberesController.create)
  .put("/:id", SportClubMemberesController.updateById)
  .delete("/:id", SportClubMemberesController.deleteById);

module.exports = sportClubMemberesRouter;