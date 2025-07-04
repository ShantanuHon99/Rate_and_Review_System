const express = require('express');
const router = express.Router();
const multer = require('multer');
const reviewController = require('../controllers/reviewController');

// Image Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// POST review
router.post('/', upload.single('photo'), reviewController.addReview);

// GET tags
router.get('/tags', reviewController.getPopularTags);

module.exports = router;
