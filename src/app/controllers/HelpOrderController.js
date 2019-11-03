import * as Yup from 'Yup';

import HelpOrder from '../models/HelpOrder';
import HelpAnswer from '../jobs/HelpAnswer';
import Queue from '../../lib/Queue';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.body;
    const { id = null } = req.params;
    const itemsPerPage = 20;
    let helps = null;

    if (id === null) {
      helps = await HelpOrder.findAndCountAll({
        where: { answer: null },
        order: ['created_at'],
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
      });
    } else {
      helps = await HelpOrder.findAndCountAll({
        where: { student_id: id },
        order: ['created_at'],
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
      });
    }

    return res.json(helps);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string()
        .min(2)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { id } = req.params;
    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const question = await HelpOrder.create({
      student_id: id,
      question: req.body.question,
    });

    return res.json(question);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string()
        .min(2)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fail' });
    }

    const { id } = req.params;
    const { answer } = req.body;

    const order = await HelpOrder.findOne({
      where: { id },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    const orderAnswer = await order.update({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(HelpAnswer.key, {
      help: orderAnswer,
    });

    return res.json(orderAnswer);
  }
}

export default new HelpOrderController();
