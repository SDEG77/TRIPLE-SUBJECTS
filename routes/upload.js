const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const Image = require("../models/Image");
const fs = require("fs");
const path = require("path");

router.post("/upload-image", upload.array("image", 200), async (req, res) => {
  try {
    const { clientId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.redirect("/ark/admin/photo-management");
    }

    for (let file of req.files) {
      const image = new Image({
        clientId,
        filename: file.filename,
        filepath: file.path,
      });

      const oldPath = file.path;
      const newPath = oldPath.replace(/\.jfif$/, ".jpg");

      if (oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
        image.filename = path.basename(newPath);
        image.filepath = newPath;
      }

      await image.save(); 
      
    }

    res.redirect("/ark/admin/photo-management");
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while uploading the images: " + error.message);
  }
});

module.exports = router;