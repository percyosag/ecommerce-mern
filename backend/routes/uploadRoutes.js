import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

// 1. Where and how to save the file
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Save files to a folder named 'uploads' in the root directory
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    // Format: originalname-timestamp.extension (e.g., image-1698765432.jpg)
    // This guarantees every uploaded file has a 100% unique name
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

// 2. Security: Only allow specific image types
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;

  // Check the file extension (.jpg)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check the mime type (image/jpeg)
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images only! (JPG, JPEG, PNG, WEBP)"));
  }
}

// 3. Initialize the middleware
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 4. The actual route
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ message: "No file uploaded or invalid file type" });
  }

  res.send({
    message: "Image uploaded successfully",
    image: `/${req.file.path.replace(/\\/g, "/")}`,
  });
});

export default router;
