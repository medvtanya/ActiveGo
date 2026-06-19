// const ChatRouter = require("express").Router();
// const ChatController = require("../controllers/chatController");

// ChatRouter
//   .get("/", ChatController.getAll)
//   .get("/:id", ChatController.getOne)
//   .post("/", ChatController.create)
//   .put("/:id", ChatController.update)
//   .delete("/:id", ChatController.delete);

// module.exports = ChatRouter;

const chatRouter = require("express").Router();
const ChatController = require("../controllers/chatController");
const multer = require("multer");
const path = require("path");

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Только изображения разрешены!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

chatRouter.get("/messages", ChatController.getMessagesChat);
chatRouter.post(
  "/upload-image",
  upload.single("image"),
  ChatController.uploadImage
);

module.exports = chatRouter;
