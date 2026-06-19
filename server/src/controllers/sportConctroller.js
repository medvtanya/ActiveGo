const SportService = require('../services/sportService')
const formatResponse = require("../utils/formatResponse");

class SportController {
    static async getAll(req, res) {
        console.log("test+++++++++++++++++++")
        try {
            const result = await SportService.getAllSport()
            return res
            .status(200)
            .json(formatResponse(200, "Все категории успешно получены", result))
        } catch (error) {
            return res
            .status(500)
            .json(formatResponse(500, "Внутренняя ошибка сервера", error.error))
        }
    }

        static async getOne(req, res) {
            try {
            const { id } = req.params; 
            const result = await SportService.getOneSport(id)
            return res
            .status(200)
            .json(formatResponse(200, "Одна категории успешно получена", result))
        } catch (error) {
            return res
            .status(500)
            .json(formatResponse(500, "Внутренняя ошибка сервера", error.error))
        }
    }

        static async create(req, res) {
        try {        
            const { type } = req.body;
            console.log(type);
            
            const result = await SportService.createSport({type})
            return res
            .status(200)
            .json(formatResponse(200, "Успешно создана новая категория", result))
        } catch (error) {
            return res
            .status(500)
            .json(formatResponse(500, "Внутренняя ошибка сервера", error.error))
        }
    }

        static async delete(req, res) {
        try {
            const { id } = req.params; 
            const result = await SportService.deleteSport(id)
            return res
            .status(200)
            .json(formatResponse(200, "Категория успешно удалена", result))
        } catch (error) {
            return res
            .status(500)
            .json(formatResponse(500, "Внутренняя ошибка сервера", error.error))
        }
    }


        static async update(req, res) {
        try {
            const { id } = req.params; 
            const { type } = req.body;
            const result = await SportService.updateSport(id, type)
            return res
            .status(200)
            .json(formatResponse(200, "Категория успешно обновлена", result))
        } catch (error) {
            return res
            .status(500)
            .json(formatResponse(500, "Внутренняя ошибка сервера", error.error))
        }
    }



}

module.exports =  SportController