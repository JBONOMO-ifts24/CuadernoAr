require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cuadernoRoutes = require('./routes/cuadernoRoutes');
const marcadorRoutes = require('./routes/marcadorRoutes');
const infoMarcadorRoutes = require('./routes/infoMarcadorRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal redirige a login
app.get('/', (req, res) => {
    res.redirect('/login.html');
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cuadernos', cuadernoRoutes);
app.use('/api/marcadores', marcadorRoutes);
app.use('/api/info-marcadores', infoMarcadorRoutes);

// Probar conexión y sincronizar modelos
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Base de datos conectada exitosamente.');

        // Sincronizar modelos con la base de datos
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados.');

        app.listen(PORT, () => {
            console.log(`El servidor está corriendo en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

startServer();
