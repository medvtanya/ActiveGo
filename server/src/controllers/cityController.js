const CityService = require('../services/CityService');
const formatResponse = require('../utils/formatResponse');

class CityController {
  static async getAll(req, res) {
    try {
      const { search } = req.query;
      console.log('CityController.getAll - запрос:', { search });
      let result;
      if (search) {
        result = await CityService.searchCities(search);
      } else {
        result = await CityService.getAllCities();
      }
      console.log('CityController.getAll - результат:', {
        count: result.length,
        cities: result.slice(0, 5).map(c => ({ id: c.id, city: c.city })) // Show first 5 cities
      });
      res.status(200).json(formatResponse(200, 'Все города', result));
    } catch (error) {
      console.log('CityController.getAll - ошибка:', error);
      res
        .status(500)
        .json(
          formatResponse(500, 'Ошибка получения городов', null, error.message)
        );
    }
  }

  static async getOne(req, res) {
    try {
      const { id } = req.params;
      const city = await CityService.getCityById(id);
      if (!city) {
        return res
          .status(404)
          .json(formatResponse(404, 'Город не найден', null));
      }
      res.status(200).json(formatResponse(200, 'Город найден', city));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, 'Ошибка получения города', null, error.message)
        );
    }
  }

  static async create(req, res) {
    try {
      const { city } = req.body;
      if (!city) {
        return res
          .status(400)
          .json(formatResponse(400, 'Название города обязательно'));
      }
      const newCity = await CityService.createCity({ city });
      res.status(201).json(formatResponse(201, 'Город создан', newCity));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, 'Ошибка создания города', null, error.message)
        );
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { city } = req.body;
      const updatedCity = await CityService.updateCity(id, { city });
      if (!updatedCity) {
        return res
          .status(404)
          .json(formatResponse(404, 'Город не найден', null));
      }
      res.status(200).json(formatResponse(200, 'Город обновлён', updatedCity));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, 'Ошибка обновления города', null, error.message)
        );
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedId = await CityService.deleteCity(id);
      if (!deletedId) {
        return res
          .status(404)
          .json(formatResponse(404, 'Город не найден', null));
      }
      res.status(200).json(formatResponse(200, 'Город удалён', deletedId));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, 'Ошибка удаления города', null, error.message)
        );
    }
  }
}

module.exports = CityController;
