// backend/modules/User/controllers/UserController.js
const db = require('../../../config/db');
const bcrypt = require('bcryptjs');

const ROLE_LEVELS = { 'superadmin': 99, 'admin': 20, 'staff': 10, 'user': 1 };
const getLevel = (role) => ROLE_LEVELS[role] || 0;

// 1. GET ALL USERS
exports.getAllUsers = async (req, res) => {
    try {
        // Tambahkan email di select
        const [users] = await db.query('SELECT id, username, full_name, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data user." });
    }
};

// 👇 2. GET USER BY ID (FUNGSI BARU YANG HILANG)
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [users] = await db.query('SELECT id, username, full_name, email, role FROM users WHERE id = ?', [id]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan." });
        }
        
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil detail user." });
    }
};

// 3. CREATE USER
exports.createUser = async (req, res) => {
    // Tambahkan email di body
    const { username, password, full_name, email, role } = req.body;
    const requesterRole = req.user.role;

    if (getLevel(requesterRole) <= getLevel(role)) {
        return res.status(403).json({ message: "Level role harus di bawah Anda." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Masukkan email ke database
        await db.query(
            'INSERT INTO users (username, password, full_name, email, role) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, full_name, email || null, role]
        );
        res.status(201).json({ message: "User berhasil ditambahkan." });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Username atau Email sudah digunakan." });
        res.status(500).json({ message: "Gagal menambah user." });
    }
};

// 4. UPDATE USER
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    // Tambahkan email di body
    const { full_name, email, password, role } = req.body;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    try {
        const [targets] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (targets.length === 0) return res.status(404).json({ message: "User tidak ditemukan." });
        const targetUser = targets[0];

        // Validasi Role (sama seperti sebelumnya)
        if (parseInt(id) === requesterId) {
            if (role && role !== targetUser.role) return res.status(403).json({ message: "Tidak bisa ubah role sendiri." });
        } else {
            if (getLevel(requesterRole) <= getLevel(targetUser.role)) return res.status(403).json({ message: "Tidak berwenang." });
            if (role && getLevel(requesterRole) <= getLevel(role)) return res.status(403).json({ message: "Role baru terlalu tinggi." });
        }

        // Siapkan Query Dinamis
        let fields = ['full_name = ?', 'email = ?'];
        let params = [full_name, email || null];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            fields.push('password = ?');
            params.push(hashedPassword);
        }
        
        if (role) {
            fields.push('role = ?');
            params.push(role);
        }

        params.push(id);
        
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        await db.query(query, params);
        
        res.json({ message: "User berhasil diperbarui." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal update user." });
    }
};

// 5. DELETE USER (Tetap sama)
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const requesterId = req.user.id;
    const requesterRole = req.user.role;

    try {
        const [targets] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        if (targets.length === 0) return res.status(404).json({ message: "User tidak ditemukan." });
        const targetUser = targets[0];

        if (parseInt(id) === requesterId) return res.status(403).json({ message: "Tidak bisa hapus diri sendiri." });
        if (getLevel(requesterRole) <= getLevel(targetUser.role)) return res.status(403).json({ message: "Tidak berwenang." });

        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: "User berhasil dihapus." });

    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus user." });
    }
};