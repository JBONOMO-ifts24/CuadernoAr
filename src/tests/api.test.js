const request = require('supertest');
const express = require('express');
const sequelize = require('../config/database');
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const Usuario = require('../models/Usuario');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Endpoints de Autenticación y Usuarios (con RBAC)', () => {
    let userToken;
    let adminToken;
    let userId;

    test('Registro de usuario exitoso (debe tener rol usuario)', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                nombre: 'Regular',
                apellido: 'User',
                usuario: 'regularuser',
                contraseña: 'password123',
                rol: 'admin' // Intentamos forzar admin
            });
        expect(res.statusCode).toEqual(201);
        userId = res.body.user.id;

        // Verificar en DB que el rol sea 'usuario'
        const user = await Usuario.findByPk(userId);
        expect(user.rol).toBe('usuario');
    });

    test('Login de usuario regular', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                usuario: 'regularuser',
                contraseña: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        userToken = res.body.token;
    });

    test('Crear un administrador manualmente para pruebas', async () => {
        const admin = await Usuario.create({
            nombre: 'Admin',
            apellido: 'Master',
            usuario: 'adminuser',
            contraseña: 'adminpassword',
            rol: 'admin'
        });
        expect(admin.rol).toBe('admin');
    });

    test('Login de administrador', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                usuario: 'adminuser',
                contraseña: 'adminpassword'
            });
        expect(res.statusCode).toEqual(200);
        adminToken = res.body.token;
    });

    test('Usuario regular NO puede actualizar a otro usuario', async () => {
        const res = await request(app)
            .put(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ nombre: 'Intento Fallido' });
        expect(res.statusCode).toEqual(403);
        expect(res.body.error).toContain('permisos de administrador');
    });

    test('Administrador SI puede actualizar a un usuario', async () => {
        const res = await request(app)
            .put(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ nombre: 'Nombre Actualizado' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Usuario actualizado exitosamente');
    });

    test('Usuario regular NO puede suspender a otro usuario', async () => {
        const res = await request(app)
            .patch(`/api/users/${userId}/suspend`)
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(403);
    });

    test('Administrador SI puede suspender a un usuario', async () => {
        const res = await request(app)
            .patch(`/api/users/${userId}/suspend`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Usuario suspendido exitosamente');
    });
});
