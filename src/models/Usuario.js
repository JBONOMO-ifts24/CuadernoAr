const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const Usuario = sequelize.define('Usuario', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    contraseña: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM('admin', 'usuario'),
        defaultValue: 'usuario',
    },
    estado: {
        type: DataTypes.ENUM('activo', 'suspendido'),
        defaultValue: 'activo',
    },
}, {
    tableName: 'usuarios',
    timestamps: true, // Esto provee createdAt (fecha_creacion) y updatedAt
    hooks: {
        beforeCreate: async (user) => {
            if (user.contraseña) {
                const salt = await bcrypt.genSalt(10);
                user.contraseña = await bcrypt.hash(user.contraseña, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('contraseña')) {
                const salt = await bcrypt.genSalt(10);
                user.contraseña = await bcrypt.hash(user.contraseña, salt);
            }
        },
    },
});

Usuario.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.contraseña);
};

module.exports = Usuario;
