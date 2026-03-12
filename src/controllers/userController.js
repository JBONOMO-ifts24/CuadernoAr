const Usuario = require('../models/Usuario');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await Usuario.findAll({
            attributes: { exclude: ['contraseña'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.params.id, {
            attributes: { exclude: ['contraseña'] }
        });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        // Solo administradores pueden actualizar usuarios
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado: se requieren permisos de administrador' });
        }

        const { nombre, apellido, usuario, rol } = req.body;
        const user = await Usuario.findByPk(req.params.id);

        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        await user.update({ nombre, apellido, usuario, rol });
        res.json({ message: 'Usuario actualizado exitosamente', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.suspendUser = async (req, res) => {
    try {
        // Solo administradores pueden suspender usuarios
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado: se requieren permisos de administrador' });
        }

        const user = await Usuario.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

        await user.update({ estado: 'suspendido' });
        res.json({ message: 'Usuario suspendido exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
