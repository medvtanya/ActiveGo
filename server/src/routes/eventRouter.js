const eventRouter = require("express").Router();
const EventController = require("../controllers/eventController");
const { verifyAccessToken } = require("../middleware/verifyTokens");
const checkAdmin = require("../middleware/checkAdmin");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

eventRouter
  .get("/", EventController.getAll)
  .get(
    "/with-complaints",
    verifyAccessToken,
    checkAdmin,
    EventController.getEventsWithComplaints
  )
  .get("/my-active", verifyAccessToken, EventController.getMyActiveEvents)
  .get("/:id", EventController.getOne)
  .post("/", upload.array("photos", 10), EventController.create)
  .put(
    "/:id",
    verifyAccessToken,
    upload.array("photos", 10),
    EventController.update
  )
  .delete("/:id", verifyAccessToken, EventController.delete)
  .post("/:id/join", verifyAccessToken, EventController.joinEvent)
  .post("/:id/leave", verifyAccessToken, EventController.leaveEvent);

module.exports = eventRouter;
