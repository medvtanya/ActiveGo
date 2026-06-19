const sportClubRouter = require("express").Router();
const SportClubController = require("../controllers/sportClub.controller");
const multer = require("multer");
const path = require("path");


sportClubRouter.use((req, res, next) => {
  console.log(`=== SportClub Route: ${req.method} ${req.path}`);
  next();
});

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

sportClubRouter
  .get("/", SportClubController.getAll)
  .get("/:id", SportClubController.getById)
  .post("/", upload.single("photo"), SportClubController.create)
  .put("/:id", upload.single("photo"), SportClubController.updateById)
  .put("/update/:id", upload.single("photo"), SportClubController.updateById)
  .delete("/delete/:id", SportClubController.deleteById);

module.exports = sportClubRouter;
