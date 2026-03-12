const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Marcador = sequelize.define('Marcador', {
    codigo_asociado: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // pertenece_cuaderno se definirá mediante asociación
}, {
    tableName: 'marcadores',
    timestamps: true,
});

module.exports = Marcador;
