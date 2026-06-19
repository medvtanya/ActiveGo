const { City } = require('../db/models');
const { Op } = require('sequelize');

class CityService {
  static async getAllCities() {
    const cities = await City.findAll();
    return cities.map((city) => city.get({ plain: true }));
  }

  static async searchCities(search) {
    console.log('CityService.searchCities - поиск:', search);
    const cities = await City.findAll({
      where: {
        city: {
          [Op.iLike]: `%${search}%`,
        },
      },
    });
    const result = cities.map((city) => city.get({ plain: true }));
    console.log('CityService.searchCities - найдено городов:', result.length);
    return result;
  }

  static async getCityById(id) {
    console.log('CityService.getCityById - поиск по ID:', id);
    const city = await City.findByPk(id);
    if (!city) {
      console.log('CityService.getCityById - город не найден');
      return null;
    }
    const result = city.get({ plain: true });
    console.log('CityService.getCityById - найден город:', result);
    return result;
  }

  static async createCity(data) {
    const city = await City.create(data);
    return city.get({ plain: true });
  }

  static async updateCity(id, data) {
    const [affectedRows] = await City.update(data, { where: { id } });
    if (affectedRows === 0) return null;
    const updatedCity = await City.findByPk(id);
    return updatedCity.get({ plain: true });
  }

  static async deleteCity(id) {
    const city = await City.findByPk(id);
    if (!city) return null;
    await city.destroy();
    return id;
  }
}

module.exports = CityService;
