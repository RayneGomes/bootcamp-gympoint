import Checkin from '../models/Chekin';
import Enroll from '../models/Enrolled';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { id } = req.params;
    const { page = 1 } = req.query;
    const itemsPerPage = 20;

    const checkins = await Checkin.findAndCountAll({
      where: { id },
      order: [['created_at', 'desc']],
      limit: itemsPerPage,
      offset: (page - 1) * itemsPerPage,
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const enrolled = await Enroll.findAll({
      where: {
        student_id: student.id,
      },
      limit: 1,
      order: [['end_date', 'desc']],
      attributes: [
        'id',
        'student_id',
        'plan_id',
        'start_date',
        'end_date',
        'price',
        'overdue',
      ],
    });

    if (!enrolled || enrolled.length === 0 || enrolled[0].overdue) {
      return res
        .status(400)
        .json({ error: 'No active plans found for the student' });
    }

    // TODO: fazer verificacao de numero de logins permitidos na semana

    return res.json(enrolled);
  }
}

export default new CheckinController();
