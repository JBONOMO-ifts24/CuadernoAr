const express = require('express');
const router = express.Router();
const marcadorController = require('../controllers/marcadorController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', marcadorController.createMarcador);
router.get('/cuaderno/:cuadernoId', marcadorController.getMarcadoresByCuaderno);

module.exports = router;
