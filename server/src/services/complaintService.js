const { Complaint } = require("../db/models");

class ComplaintService {
  static async getAllComplaints() {
    const complaints = await Complaint.findAll();
    return complaints;
  }

  static async getOneComplaint(id) {
    const complaint = await Complaint.findByPk(id);
    return complaint;
  }

  static async createComplaint({
    userId,
    eventId,
    content,
    type_Of_complaint,
  }) {
    const complaint = await Complaint.create({
      userId,
      eventId,
      content,
      type_Of_complaint,
    });
    return complaint;
  }

  static async deleteComplaint(id) {
    const complaint = await Complaint.findByPk(id);
    complaint.destroy();
    return id;
  }

  static async updateComplaint(id, data) {
    const [affectedRows] = await Complaint.update(data, {
      where: { id },
      returning: true,
    });

    if (affectedRows === 0) {
      throw new Error(`Жалоба с id ${id} не найдена`);
    }

    const updatedComplaint = await Complaint.findByPk(id);
    return updatedComplaint;
  }
}

module.exports = ComplaintService;
