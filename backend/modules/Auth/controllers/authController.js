// backend/modules/Auth/controllers/authController.js
const db = require('../../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    // ... (kode login yang sudah ada biarkan saja) ...
    const { username, password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(401).json({ message: 'Username atau password salah' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Username atau password salah' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            message: 'Login berhasil',
            token,
            user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 👇 TAMBAHKAN FUNGSI BARU INI DI BAWAH LOGIN

exports.getProfile = async (req, res) => {
    try {
        // req.user.id didapat dari middleware verifyToken
        const [users] = await db.query('SELECT id, username, full_name, role, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ message: "User tidak ditemukan." });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil profil." });
    }
};

exports.updateProfile = async (req, res) => {
    const { full_name, username } = req.body; // Password tidak boleh diubah di sini
    try {
        // Cek apakah username sudah dipakai orang lain (jika username diubah)
        if (username) {
            const [exists] = await db.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, req.user.id]);
            if (exists.length > 0) return res.status(400).json({ message: "Username sudah digunakan." });
        }

        await db.query(
            'UPDATE users SET full_name = ?, username = ? WHERE id = ?', 
            [full_name, username, req.user.id]
        );
        
        // Kirim balik data terbaru
        res.json({ message: "Profil berhasil diperbarui.", full_name, username });
    } catch (error) {
        res.status(500).json({ message: "Gagal update profil." });
    }
};

exports.changePassword = async (req, res) => {
    const { current_password, new_password } = req.body;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        const user = users[0];

        // 1. Cek Password Lama
        const isMatch = await bcrypt.compare(current_password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Password lama salah." });

        // 2. Hash Password Baru
        const hashedPassword = await bcrypt.hash(new_password, 10);

        // 3. Simpan
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
        res.json({ message: "Password berhasil diubah." });

    } catch (error) {
        res.status(500).json({ message: "Gagal mengganti password." });
    }
};