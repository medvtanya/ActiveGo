const { Sport } = require('../db/models');

class SportService {
  static async getAllSport() {
    const sports = await Sport.findAll();
    const result = sports.map((el) => el.get({ plain: true }));
    return result;
  }

  static async getOneSport(id) {
    const sport = await Sport.findByPk(id);
    const result = sport.get({ plain: true });
    return result;
  }

  static async createSport(sportData) {    
    const checkSport = await Sport.findOne({ where: { type: sportData.type } });
    console.log(checkSport);

    
    if (checkSport) {
      return false;
    }
    console.log("test=============")
    const sport = await Sport.create(sportData);
    return sport
  }

  static async deleteSport(id) {
    const sport = await Sport.findByPk(id);
    sport.destroy();
    return sport;
  }

  static async updateSport(id, data) {
    const sport = await Sport.update(data, { where: { id } });
    if (sport) {
      return sport;
    }
    return false;
  }

}

module.exports = SportService;
