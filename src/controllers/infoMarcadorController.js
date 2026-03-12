const { InfoMarcador } = require('../models/associations');

exports.createInfo = async (req, res) => {
    try {
        const { pertenece_marcador, tipo_info, data } = req.body;

        // Validar si ya existe información activa para este marcador
        const existingActive = await InfoMarcador.findOne({
            where: { pertenece_marcador, activo: true }
        });

        if (existingActive) {
            return res.status(400).json({ error: "No se puede crear información para este Marcador, ya tiene información activa" });
        }

        const info = await InfoMarcador.create({ pertenece_marcador, tipo_info, data });
        res.status(201).json(info);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.updateInfo = async (req, res) => {
    try {
        const info = await InfoMarcador.findByPk(req.params.id);
        if (!info) return res.status(404).json({ error: 'Información no encontrada' });

        await info.update(req.body);
        res.json(info);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getInfoByMarcador = async (req, res) => {
    try {
        const infos = await InfoMarcador.findAll({
            where: { pertenece_marcador: req.params.marcadorId, activo: true }
        });
        res.json(infos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteInfo = async (req, res) => {
    try {
        const info = await InfoMarcador.findByPk(req.params.id);
        if (!info) return res.status(404).json({ error: 'Información no encontrada' });

        await info.update({ 
            activo: false, 
            fecha_baja: new Date() 
        });
        res.json({ message: 'Información dada de baja correctamente', info });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
