const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const uploadReceipt = require("../config/receipt-multer");
const Image = require("../models/Image");
const Receipt = require("../models/Receipt");
const fs = require("fs");
const path = require("path");
const Booking = require("../models/Booking");

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

router.post("/client/booking/upload", uploadReceipt.array("image", 200), async (req, res) => {
  try {
    const { clientId } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.redirect("/ark/client/booking");
    }

    for (let file of req.files) {
      const image = new Receipt({
        clientId,
        bookingId: "none",
        uploaded: "no",
        filename: file.filename,
        filepath: file.path,
      });
      console.log(image._id)
      const oldPath = file.path;
      const newPath = oldPath.replace(/\.jfif$/, ".jpg");

      if (oldPath !== newPath) {
        fs.renameSync(oldPath, newPath);
        image.filename = path.basename(newPath);
        image.filepath = newPath;
      }

      await image.save();
    }
    
    res.redirect(`./upload/${clientId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while uploading the images: " + error.message);
  }
});

router.get("/client/booking/upload/:clientID", async (req, res) => {
  const detectPartner = await Booking.findOne({client_id: String(req.params.clientID), receipt_uploaded: "no",});
  console.log(detectPartner)
  if(detectPartner) {
    const id = detectPartner.id;

    await Receipt.updateOne({clientId: String(req.params.clientID), uploaded: "no"}, { uploaded: "yes", bookingId: id, })
    await Booking.updateOne({client_id: String(req.params.clientID), receipt_uploaded: "no"}, {receipt_uploaded: "yes",})
  }
  
  res.redirect("/ark/client/history");
})

module.exports = router;