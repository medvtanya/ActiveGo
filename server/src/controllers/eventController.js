const EventService = require("../services/eventService");
const formatResponse = require("../utils/formatResponse");

class EventController {
  static async getAll(req, res) {
    try {
      const result = await EventService.getAllEvents();
      res.status(200).json(formatResponse(200, "Все события", result, null));
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Не удалось получить все события. Ошибка Сервера",
            null,
            error.message
          )
        );
    }
  }

  static async getEventsWithComplaints(req, res) {
    try {
      const result = await EventService.getEventsWithComplaints();

      if (result && Array.isArray(result)) {
        result.forEach((event) => {
          if (event.photos) {
            event.photos = event.photos.map((photo) =>
              photo.startsWith("http") ? photo : `${photo}`
            );
          }
        });
      }

      res
        .status(200)
        .json(formatResponse(200, "События с жалобами", result, null));
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Не удалось получить события с жалобами. Ошибка Сервера",
            null,
            error.message
          )
        );
    }
  }

  static async getOne(req, res) {
    try {
      const { id } = req.params;
      const result = await EventService.getOneEvent(id);

      if (!result) {
        return res
          .status(404)
          .json(formatResponse(404, "Событие не найдено", null, null));
      }

      if (result.photos) {
        result.photos = result.photos.map((photo) =>
          photo.startsWith("http") ? photo : `${photo}`
        );
      }
      res
        .status(200)
        .json(formatResponse(200, "Получено одно событие", result, null));
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Не удалось получить одно событие. Ошибка Сервера",
            null,
            error.message
          )
        );
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res
          .status(400)
          .json(
            formatResponse(
              400,
              "Невалидный ID события",
              null,
              "Невалидный ID события"
            )
          );
      }

      const result = await EventService.deleteEvent(id);
      res
        .status(200)
        .json(formatResponse(200, "Событие успешно удалено", result, null));
    } catch (error) {
      console.log("=============EventController.delete=============", error);

      if (error.message.includes("не найдено")) {
        return res
          .status(404)
          .json(formatResponse(404, "Событие не найдено", null, error.message));
      }

      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Не удалось удалить событие. Ошибка сервера",
            null,
            error.message
          )
        );
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const oneEvent = await EventService.getOneEvent(id);
      oneEvent.photos.push();

      let photos = [];
      if (req.body.existingPhotos) {
        try {
          photos = JSON.parse(req.body.existingPhotos);
        } catch {
          photos = [];
        }
      }

      if (req.files && req.files.length > 0) {
        const newPhotos = req.files.map((f) => {
          let name = f.filename
            .replace(/^\/images\//, "")
            .replace(/^images\//, "");
          return `/images/${name}`;
        });
        photos = [...photos, ...newPhotos].filter(
          (v, i, a) => a.indexOf(v) === i
        );
      }

      photos = photos.filter(
        (p) =>
          typeof p === "string" &&
          p.trim() !== "" &&
          p !== "{}" &&
          p.startsWith("/images/")
      );
      const {
        sportId,
        title,
        location,
        content,
        member,
        level,
        date,
        userId,
        cityId,
        coords,
      } = req.body;

      let processedLevel = level;
      if (typeof level === "string") {
        try {
          processedLevel = JSON.parse(level);
        } catch (error) {
          console.error("Ошибка парсинга level:", error);
          processedLevel = [];
        }
      }

      if (!Array.isArray(processedLevel)) {
        processedLevel = [];
      }

      const result = await EventService.updateEvent(id, {
        photos,
        sportId,
        title,
        location,
        content,
        member,
        level: processedLevel,
        date,
        userId,
        cityId,
        coords: typeof coords === "string" ? JSON.parse(coords) : coords,
      });

      res
        .status(200)
        .json(formatResponse(200, "Событие успешно обновлено", result, null));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(
            500,
            "Не удалось обновить событие",
            null,
            error.message
          )
        );
    }
  }

  static async create(req, res) {
    try {
      const {
        sportId,
        title,
        location,
        content,
        member,
        level,
        date,
        userId,
        cityId,
        coords,
      } = req.body;
      const photos = req.files
        ? req.files.map((f) => {
            let name = f.filename
              .replace(/^\/images\//, "")
              .replace(/^images\//, "");
            return `/images/${name}`;
          })
        : [];

      console.log("---------", {
        sportId,
        title,
        location,
        content,
        member,
        level,
        date,
        userId,
        cityId,
        coords,
      });

      let processedLevel = level;
      if (typeof level === "string") {
        try {
          processedLevel = JSON.parse(level);
        } catch (error) {
          console.error("Ошибка парсинга level:", error);
          processedLevel = [];
        }
      }

      if (!Array.isArray(processedLevel)) {
        processedLevel = [];
      }

      const result = await EventService.createEvent({
        photos,
        sportId,
        title,
        location,
        content,
        member,
        level: processedLevel,
        date,
        userId,
        cityId,
        coords: typeof coords === "string" ? JSON.parse(coords) : coords,
      });
      res
        .status(200)
        .json(formatResponse(200, "Событие успешно создано", result, null));
    } catch (error) {
      res
        .status(500)
        .json(
          formatResponse(500, "Не удалось создать событие", null, error.message)
        );
    }
  }

  static async joinEvent(req, res) {
    try {
      const { id: eventId } = req.params;
      const { id: userId } = res.locals.user;

      const result = await EventService.joinEvent(eventId, userId);

      res
        .status(200)
        .json(
          formatResponse(200, "Вы успешно подписались на событие", result, null)
        );
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .json(
          formatResponse(
            400,
            "Не удалось подписаться на событие",
            null,
            error.message
          )
        );
    }
  }

  static async leaveEvent(req, res) {
    try {
      const { id: eventId } = req.params;
      const { id: userId } = res.locals.user;

      const result = await EventService.leaveEvent(eventId, userId);
      res
        .status(200)
        .json(formatResponse(200, "Вы вышли из события", result, null));
    } catch (error) {
      res
        .status(400)
        .json(formatResponse(400, "Ошибка выхода", null, error.message));
    }
  }

  static async getMyActiveEvents(req, res) {
    try {
      const userId = res.locals.user.id;
      const events = await EventService.getUserFutureEvents(userId);
      res
        .status(200)
        .json(formatResponse(200, "Мои активные события", events, null));
    } catch (error) {
      res
        .status(500)
        .json(formatResponse(500, "Ошибка сервера", null, error.message));
    }
  }
}

module.exports = EventController;
