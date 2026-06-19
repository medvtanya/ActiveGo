const express = require('express');
const CityController = require('../controllers/cityController');
const router = express.Router();

router.get('/cities', CityController.getAll);
router.get('/cities/:id', CityController.getOne);
router.post('/cities', CityController.create);
router.put('/cities/:id', CityController.update);
router.delete('/cities/:id', CityController.delete);

module.exports = router;
