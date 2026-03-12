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

module.exports = {
    Usuario,
    Cuaderno,
    Marcador,
    InfoMarcador
};
