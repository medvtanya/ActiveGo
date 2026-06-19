const routes = require("express").Router();
const formatResponse = require("../utils/formatResponse");
const eventRouter = require("./eventRouter");
const sportClubRouter = require("./SportClub.routes");
const sportClubMemberesRouter = require("./SportClubMemberes.routes");
const complaintRouter = require("./сomplaintRouter");
const authRouter = require("./auth.routes");
const cityRouter = require("./City.routes");
const sportRouter = require("./sport.routes");
const chatRouter = require("./chat.routes");
const userRouter = require("./user.routes");
const userSportRouter = require("./userSport.routes");

routes.use("/sportClub", sportClubRouter);
routes.use("/sportclubmemberes", sportClubMemberesRouter);
routes.use("/event", eventRouter);
routes.use("/complaint", complaintRouter);
routes.use("/auth", authRouter);
routes.use("/city", cityRouter);
routes.use("/usersport", userSportRouter);

routes.use("/sport", sportRouter);
routes.use("/chat", chatRouter);

routes.use("/user", userRouter);

routes.use((req, res) => {
  res
    .status(404)
    .json(
      formatResponse(404, "Страница не найдена", null, "Страница не найдена")
    );
});

module.exports = routes;
