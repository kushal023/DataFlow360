const express = require('express');
const {
  uploadCsvDataFromS3,
} = require('../controllers/blogController');

const router = express.Router();

router.post('/upload', uploadCsvDataFromS3);

module.exports = router;
