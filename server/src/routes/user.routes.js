const router = require("express").Router();
const UserController = require("../controllers/userController");
const validateId = require("../middleware/validateId");
const { verifyRefreshToken } = require("../middleware/verifyTokens");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../public/images"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

function fileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Только изображения!"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const handleMulterError = (error, req, res, next) => {
  console.log("Multer error:", error);
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: 400,
        message: "Файл слишком большой (максимум 5MB)",
        error: error.message,
      });
    }
  }
  return res.status(400).json({
    status: 400,
    message: "Ошибка загрузки файла",
    error: error.message,
  });
};

router.get("/:id", verifyRefreshToken, validateId, UserController.getOne);

router.put(
  "/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "telegram_photo", maxCount: 1 },
  ]),
  verifyRefreshToken,
  UserController.update
);

router.delete("/:id", verifyRefreshToken, validateId, UserController.delete);

router.patch(
  "/:id/deactivate",
  verifyRefreshToken,
  validateId,
  UserController.deactivate
);

router.use(handleMulterError);

router.post("/auth/request-reset", UserController.requestPasswordReset);
router.post("/auth/verify-reset", UserController.verifyPasswordReset);

module.exports = router;
