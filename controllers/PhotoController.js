const Photo = require('../models/Photo');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'img_uploads/index_photos/'); // Path where images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage }).single('image'); // Handle a single file with the field name 'image'

// List all photos
exports.listPhotos = async (req, res) => {
    try {
        const photos = await Photo.find();
        res.render('admin/indexmanager', { photos });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Add a new photo
exports.addPhoto = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to upload image');
        }

        try {
            const newPhoto = new Photo({
                title: req.body.title || '', // Optional title field
                image_path: `img_uploads/index_photos/${req.file.filename}`, // Store the relative path for the new directory
            });
            await newPhoto.save();
            res.redirect('/ark/admin/indexmanager'); // Redirect to indexmanager page after success
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    });
    
};

// Delete a photo
exports.deletePhoto = async (req, res) => {
    try {
        await Photo.findByIdAndDelete(req.body.id);
        res.redirect('/ark/admin/indexmanager');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
