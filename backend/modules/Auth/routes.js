// backend/modules/Auth/routes.js
const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
// Pastikan path middleware benar (naik 2 level ke root modules, lalu naik 1 lagi ke backend root, lalu ke middlewares)
const { verifyToken } = require('../../middlewares/auth'); 

router.post('/login', authController.login);

// 👇 TAMBAHKAN RUTE INI
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.put('/change-password', verifyToken, authController.changePassword);

module.exports = router;