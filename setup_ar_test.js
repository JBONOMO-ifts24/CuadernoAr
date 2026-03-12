const request = require('supertest');
const express = require('express');
const sequelize = require('./src/config/database');
const fs = require('fs');
const path = require('path');
const { Usuario, Cuaderno, Marcador, InfoMarcador } = require('./src/models/associations');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.static(path.join(__dirname, 'src', 'public')));

async function setupTestData() {
    await sequelize.sync({ force: true });
    
    // Create User & Notebook
    const user = await Usuario.create({ nombre: 'AR', apellido: 'Test', usuario: 'artest', contraseña: 'pw' });
    const notebook = await Cuaderno.create({ identificador: 'AR-NB1', nombre_cuaderno: 'AR Test Notebook', id_usuario: user.id, password: 'AR12' });
    
    // Create 2 Barcode Markers
    const m1 = await Marcador.create({ pertenece_cuaderno: notebook.id, codigo_asociado: 5 });
    const m2 = await Marcador.create({ pertenece_cuaderno: notebook.id, codigo_asociado: 12 });
    
    // Create Active Info for Markers
    await InfoMarcador.create({ pertenece_marcador: m1.id, tipo_info: 'texto', data: 'Texto Holográfico 1', activo: true });
    await InfoMarcador.create({ pertenece_marcador: m2.id, tipo_info: 'imagen', data: 'imagen.jpg', activo: true });

    // Generate Token
    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET || 'secret_key');
    
    return { notebookId: notebook.id, token };
}

async function test() {
    try {
        const { notebookId, token } = await setupTestData();
        console.log(`Test Data ready. Log in to http://localhost:3000/cuaderno.html?id=${notebookId} to verify.`);
        
        // Output instructions for manual verification since AR is strictly frontend
        console.log(`\nTo test manually:
1. Ensure the server is running (npm run dev).
2. Open the browser console and set the token in localStorage:
   localStorage.setItem('token', '${token}')
3. Navigate to: /cuaderno.html?id=${notebookId}
4. Inspect the DOM to verify <a-marker type="barcode" value="5"> and value="12" exist.`);

    } catch (e) {
        console.error(e);
    } finally {
        await sequelize.close();
    }
}

test();
