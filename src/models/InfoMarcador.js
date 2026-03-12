const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InfoMarcador = sequelize.define('InfoMarcador', {
    tipo_info: {
        type: DataTypes.ENUM('texto', 'imagen', 'video', '3d', 'link'),
        allowNull: false,
    },
    data: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    fecha_baja: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    // pertenece_marcador se definirá mediante asociación
}, {
    tableName: 'info_marcadores',
    timestamps: true, // Esto provee fecha_creacion (createdAt)
});

module.exports = InfoMarcador;
