const Usuario = require('./Usuario');
const Cuaderno = require('./Cuaderno');
const Marcador = require('./Marcador');
const InfoMarcador = require('./InfoMarcador');

// Definición de asociaciones

// Un Cuaderno tiene muchos Marcadores
Cuaderno.hasMany(Marcador, { foreignKey: 'pertenece_cuaderno', as: 'marcadores' });
Marcador.belongsTo(Cuaderno, { foreignKey: 'pertenece_cuaderno', as: 'cuaderno' });

// Un Marcador tiene mucha Información asociada
Marcador.hasMany(InfoMarcador, { foreignKey: 'pertenece_marcador', as: 'informaciones' });
InfoMarcador.belongsTo(Marcador, { foreignKey: 'pertenece_marcador', as: 'marcador' });

// Un Usuario tiene muchos Cuadernos
Usuario.hasMany(Cuaderno, { foreignKey: 'id_usuario', as: 'cuadernos' });
Cuaderno.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

module.exports = {
    Usuario,
    Cuaderno,
    Marcador,
    InfoMarcador
};
