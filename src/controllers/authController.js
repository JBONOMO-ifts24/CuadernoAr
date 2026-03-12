const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        const { nombre, apellido, usuario, contraseña } = req.body;
        // Forzamos que el rol sea siempre 'usuario' en el registro público
        const user = await Usuario.create({
            nombre,
            apellido,
            usuario,
            contraseña,
            rol: 'usuario'
        });
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: { id: user.id, usuario: user.usuario } });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;
        const user = await Usuario.findOne({ where: { usuario } });

        if (!user || !(await user.validPassword(contraseña))) {
            return res.status(401).json({ error: 'Credenciales Incorrectas' });
        }

        if (user.estado !== 'activo') {
            return res.status(403).json({ error: 'Usuario suspendido' });
        }

        const token = jwt.sign(
            { id: user.id, rol: user.rol },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: '1h' }
        );

        res.json({ 
            message: 'Login exitoso', 
            token, 
            user: { id: user.id, usuario: user.usuario, rol: user.rol } 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
