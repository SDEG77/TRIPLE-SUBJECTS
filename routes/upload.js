const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const Image = require("../models/Image");
const fs = require("fs");
const path = require("path");

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const { clientId } = req.body;

    if (!req.file) {
      return res.redirect("/ark/admin/photo-management");
    }

    const image = new Image({
      clientId,
      filename: req.file.filename,
      filepath: req.file.path,
    });

    await image.save();

    const oldPath = req.file.path;
    const newPath = oldPath.replace(/\.jfif$/, ".jpg");

    if (oldPath !== newPath) {
      fs.rename(oldPath, newPath, async (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error renaming the file.");
        }

        image.filename = path.basename(newPath);
        image.filepath = newPath;

        await image.save();
      });
    }

    res.redirect("/ark/admin/photo-management");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send("An error occurred while uploading the image: " + error.message);
  }
});

module.exports = router;
