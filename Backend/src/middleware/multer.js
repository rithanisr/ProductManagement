const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png/;
  const isFileTypeValid = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const isMimeTypeValid = allowedExtensions.test(file.mimetype.toLowerCase());

  if (isFileTypeValid && isMimeTypeValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png) are allowed"));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

const uploadSingleImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Image must be smaller than 5MB"
          : err.message;

      return res.status(400).json({ error: message });
    }

    req.body = req.body || {};
    next();
  });
};

module.exports = {
  upload,
  uploadSingleImage,
};
