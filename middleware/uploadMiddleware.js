const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "events",
      resource_type: file.mimetype.startsWith("video") ? "video" : "image",
      public_id: Date.now() + "-" + file.originalname.split(".")[0],
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image", "video"];
  if (allowedTypes.some((type) => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
