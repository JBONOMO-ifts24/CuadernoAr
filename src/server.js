require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');
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

        const HTTPS_ENABLE = process.env.HTTPS_ENABLE === 'true';

        if (HTTPS_ENABLE) {
            const certPath = path.join(__dirname, '..', '.certs', 'cert.pem');
            const keyPath = path.join(__dirname, '..', '.certs', 'key.pem');

            if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
                const options = {
                    key: fs.readFileSync(keyPath),
                    cert: fs.readFileSync(certPath)
                };
                https.createServer(options, app).listen(PORT, () => {
                    console.log(`Servidor HTTPS corriendo en: https://localhost:${PORT}`);
                });
            } else {
                console.error('Error: No se encontraron los certificados en .certs/');
                console.log('Ejecuta el script de generacin de certificados o asegrate de que existan.');
                // Fallback a HTTP si fallan los certificados
                app.listen(PORT, () => {
                    console.log(`Servidor HTTP (fallback) corriendo en: http://localhost:${PORT}`);
                });
            }
        } else {
            app.listen(PORT, () => {
                console.log(`Servidor HTTP corriendo en: http://localhost:${PORT}`);
            });
        }
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

startServer();
