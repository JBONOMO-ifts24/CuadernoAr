const express = require('express');
const router = express.Router();
const infoMarcadorController = require('../controllers/infoMarcadorController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', infoMarcadorController.createInfo);
router.put('/:id', infoMarcadorController.updateInfo);
router.get('/marcador/:marcadorId', infoMarcadorController.getInfoByMarcador);
router.delete('/:id', infoMarcadorController.deleteInfo);

module.exports = router;
