const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const crypto = require('crypto');

const Cuaderno = sequelize.define('Cuaderno', {
    identificador: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        comment: 'Código especial del modelo'
    },
    nombre_cuaderno: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING(4),
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM('activo', 'suspendido'),
        defaultValue: 'activo',
    },
}, {
    tableName: 'cuadernos',
    timestamps: true,
    hooks: {
        beforeValidate: (cuaderno) => {
            if (!cuaderno.password) {
                // Generar código aleatorio de 4 caracteres (alfanumérico)
                cuaderno.password = crypto.randomBytes(2).toString('hex').slice(0, 4).toUpperCase();
            }
        }
    }
});

module.exports = Cuaderno;
