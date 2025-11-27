// backend/modules/Auth/controllers/userManagementController.js
const db = require('../../../config/db');
const bcrypt = require('bcryptjs');

// 1. GET ALL USERS (Admin Only)
exports.getAllUsers = async (req, res) => {
    try {
        // Ambil data users, JANGAN ambil password
        const [users] = await db.query('SELECT id, username, full_name, email, role, created_at FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil daftar pengguna.' });
    }
};

// 2. CREATE NEW USER (Admin Only) - Memerlukan hashing
exports.createUser = async (req, res) => {
    const { username, password, full_name, email, role } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const query = `INSERT INTO users (username, password, full_name, email, role) VALUES (?, ?, ?, ?, ?)`;
        await db.query(query, [username, hashedPassword, full_name, email, role]);

        res.status(201).json({ message: 'Pengguna baru berhasil ditambahkan.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
             return res.status(409).json({ message: 'Username atau Email sudah digunakan.' });
        }
        res.status(500).json({ message: 'Gagal menambahkan pengguna.' });
    }
};

// 3. DELETE USER (Admin Only)
exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: `Pengguna ID ${id} berhasil dihapus.` });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus pengguna.' });
    }
};

// 4. GET USER BY ID (Untuk pre-fill form Edit)
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [users] = await db.query('SELECT id, username, full_name, email, role, created_at FROM users WHERE id = ?', [id]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data pengguna.' });
    }
};

// 5. UPDATE USER (Admin dapat mengubah Role, Nama, Email, dll. tapi TIDAK password dan username)
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { full_name, email, role } = req.body; 
    
    try {
        const query = `
            UPDATE users 
            SET full_name = ?, email = ?, role = ?
            WHERE id = ?
        `; // Asumsi: Admin tidak mengubah password melalui form ini.

        await db.query(query, [full_name, email, role, id]);
        
        res.json({ message: 'Data pengguna berhasil diperbarui.' });

    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui data pengguna.' });
    }
};