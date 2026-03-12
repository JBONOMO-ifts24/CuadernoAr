const express = require('express');
const router = express.Router();
const cuadernoController = require('../controllers/cuadernoController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', cuadernoController.createCuaderno);
router.get('/', cuadernoController.getAllCuadernos);
router.put('/:id', cuadernoController.updateCuaderno);

module.exports = router;
