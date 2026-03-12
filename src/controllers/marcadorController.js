const { Marcador } = require('../models/associations');

exports.createMarcador = async (req, res) => {
    try {
        if (req.user.rol !== 'admin') {
            return res.status(403).json({ error: 'Solo administradores pueden crear marcadores' });
        }
        const { codigo_asociado, pertenece_cuaderno } = req.body;
        const marcador = await Marcador.create({ codigo_asociado, pertenece_cuaderno });
        res.status(201).json(marcador);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getMarcadoresByCuaderno = async (req, res) => {
    try {
        const marcadores = await Marcador.findAll({
            where: { pertenece_cuaderno: req.params.cuadernoId }
        });
        res.json(marcadores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
