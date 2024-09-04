// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const path = require('path');

// 设置 Multer 文件存储路径和文件名
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // 文件存储路径
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 文件名
  }
});

const upload = multer({ storage: storage });

// 定义上传文件路由
router.post('/upload', upload.single('song'), uploadController.uploadFile);

module.exports = router;
