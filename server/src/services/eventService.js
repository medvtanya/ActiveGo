const { Event, User, Complaint } = require("../db/models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");

class EventService {
  static async getAllEvents() {
    const events = await Event.findAll({
      include: [
        {
          model: User,
          as: "participants",
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    });
    return events;
  }

  static async getOneEvent(id) {
    const event = await Event.findByPk(id, {
      include: [
        {
          model: User,
          as: "participants",
          attributes: ["id"],
          through: { attributes: [] },
        },
        {
          model: Complaint,
          as: "complaints",
          attributes: ["id", "content", "type_Of_complaint", "createdAt"],
        },
      ],
    });
    return event;
  }

  static async createEvent({
    photos,
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
  }) {
    const event = await Event.create({
      photos,
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
    return event;
  }

  static async deleteEvent(id) {
    const event = await Event.findByPk(id);
    if (!event) {
      throw new Error(`Событие с id ${id} не найдено`);
    }

    if (event.photos && Array.isArray(event.photos)) {
      console.log("=== starting photo deletion, count:", event.photos.length);

      for (const photo of event.photos) {
        try {
          const fileName = photo
            .replace(/^\/images\//, "")
            .replace(/^images\//, "");
          const filePath = path.join(
            __dirname,
            "../../public/images",
            fileName
          );

          console.log("=== trying to delete event photo:", filePath);

          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("=== event photo deleted successfully:", fileName);
          } else {
            console.log(
              "=== event photo file does not exist, skipping:",
              fileName
            );
          }
        } catch {
          console.log("=== error deleting event photo");
        }
      }
    } else {
      console.log("=== no photos to delete or photos is not an array");
    }

    await event.destroy();

    return id;
  }

  static async getEventsWithComplaints() {
    const events = await Event.findAll({
      include: [
        {
          model: User,
          as: "participants",
          attributes: ["id"],
          through: { attributes: [] },
        },
        {
          model: Complaint,
          as: "complaints",
          attributes: ["id", "content", "type_Of_complaint", "createdAt"],
        },
      ],
      where: {
        "$complaints.id$": {
          [Op.ne]: null,
        },
      },
    });
    return events;
  }

  static async updateEvent(id, data) {
    const [affectedRows] = await Event.update(data, {
      where: { id },
      returning: true,
    });

    if (affectedRows === 0) {
      throw new Error(`Событие с id ${id} не найдено`);
    }

    const updatedEvent = await Event.findByPk(id);
    return updatedEvent;
  }

  static async joinEvent(eventId, userId) {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new Error("Событие не найдено");
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const isAlreadyJoined = await event.hasParticipant(user);
    if (isAlreadyJoined) {
      throw new Error("Вы уже подписаны на это событие");
    }

    await event.addParticipant(user);

    await event.increment("member", { by: 1 });

    return event.reload();
  }

  static async leaveEvent(eventId, userId) {
    try {
      const event = await Event.findByPk(eventId);
      if (!event) throw new Error("Событие не найдено");

      const user = await User.findByPk(userId);
      if (!user) throw new Error("Пользователь не найден");

      await event.removeParticipant(user);

      await event.decrement("member", { by: 1 });

      return event.reload({
        include: [
          {
            model: User,
            as: "participants",
            attributes: ["id"],
            through: { attributes: [] },
          },
        ],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getUserFutureEvents(userId) {
    const { EventParticipants, Event } = require("../db/models");
    const { Op } = require("sequelize");

    const participantRows = await EventParticipants.findAll({
      where: { userId },
      attributes: ["eventId"],
    });
    const eventIds = participantRows.map((row) => row.eventId);

    const now = new Date();
    const events = await Event.findAll({
      where: {
        id: eventIds,
        date: { [Op.gte]: now },
      },
    });
    return events;
  }
}

module.exports = EventService;
