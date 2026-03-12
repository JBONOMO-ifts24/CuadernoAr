const request = require('supertest');
const express = require('express');
const sequelize = require('../config/database');
const { Cuaderno, Marcador, Usuario } = require('../models/associations');
const cuadernoRoutes = require('../routes/cuadernoRoutes');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/cuadernos', cuadernoRoutes);

describe('Creación de Cuadernos y Marcadores automáticos', () => {
    let adminToken;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
        
        // Crear admin
        await request(app)
            .post('/api/auth/register')
            .send({
                nombre: 'Admin',
                apellido: 'User',
                usuario: 'adminuser',
                contraseña: 'password123',
                rol: 'admin'
            });

        // Login admin para obtener token
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                usuario: 'adminuser',
                contraseña: 'password123'
            });
        
        // Forzar rol admin en DB porque register lo pone como usuario por defecto
        await Usuario.update({ rol: 'admin' }, { where: { usuario: 'adminuser' } });
        
        // Volver a loguear para tener el token con el rol correcto si el token incluye el rol
        const loginRes2 = await request(app)
            .post('/api/auth/login')
            .send({
                usuario: 'adminuser',
                contraseña: 'password123'
            });
        adminToken = loginRes2.body.token;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('Debe crear un cuaderno y 10 marcadores automáticamente', async () => {
        const res = await request(app)
            .post('/api/cuadernos')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                identificador: 'C001',
                nombre_cuaderno: 'Mi Primer Cuaderno'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.identificador).toBe('C001');

        const cuadernoId = res.body.id;

        // Verificar que existan 10 marcadores asociados
        const marcadores = await Marcador.findAll({
            where: { pertenece_cuaderno: cuadernoId }
        });

        expect(marcadores.length).toBe(10);
        
        const codigos = marcadores.map(m => m.codigo_asociado).sort((a, b) => a - b);
        expect(codigos).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
});
