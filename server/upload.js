const multer = require("multer");
const storage = multer.diskStorage({
  //Specify the destination directory where the file needs to be saved
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  //Specify the name of the file. date is prefixed to avoid overwrite of files.
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("INVALID_TYPE"));
    }
  },
});

module.exports = upload;
