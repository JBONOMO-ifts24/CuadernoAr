const { Cuaderno, Marcador } = require('../models/associations');
const sequelize = require('../config/database');

exports.createCuaderno = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'Solo administradores pueden crear cuadernos' });
        }
        const { identificador, nombre_cuaderno, id_usuario } = req.body;
        
        // El id_usuario puede venir en el body (admin asignando) o ser el del usuario logueado
        const usuarioAsignado = id_usuario || req.user.id;

        const cuaderno = await Cuaderno.create({ 
            identificador, 
            nombre_cuaderno, 
            id_usuario: usuarioAsignado 
        }, { transaction: t });

        // Crear 10 marcadores automáticamente (códigos 1 al 10)
        const marcadoresData = [];
        for (let i = 1; i <= 10; i++) {
            marcadoresData.push({
                codigo_asociado: i,
                pertenece_cuaderno: cuaderno.id
            });
        }
        await Marcador.bulkCreate(marcadoresData, { transaction: t });

        await t.commit();
        res.status(201).json(cuaderno);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

exports.getMyCuadernos = async (req, res) => {
    try {
        const cuadernos = await Cuaderno.findAll({
            where: { id_usuario: req.user.id }
        });
        res.json(cuadernos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllCuadernos = async (req, res) => {
    try {
        const cuadernos = await Cuaderno.findAll();
        res.json(cuadernos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCuaderno = async (req, res) => {
    try {
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'Solo administradores pueden modificar cuadernos' });
        }
        const cuaderno = await Cuaderno.findByPk(req.params.id);
        if (!cuaderno) return res.status(404).json({ error: 'Cuaderno no encontrado' });

        await cuaderno.update(req.body);
        res.json(cuaderno);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
