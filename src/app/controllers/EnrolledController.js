import * as Yup from 'yup';
import { addMonths, isBefore, parseISO } from 'date-fns';

import Enrolled from '../models/Enrolled';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';
import Student from '../models/Student';

import SubscriptionMail from '../jobs/SubscriptionMail';

class EnrolledController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const limitPage = 20;

    const enroleds = await Enrolled.findAll({
      order: ['start_date'],
      limit: limitPage,
      offset: (page - 1) * limitPage,
      attributes: ['id', 'start_date', 'end_date', 'price'],
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'price', 'duration'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(enroleds);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .integer()
        .required(),
      plan_id: Yup.number()
        .positive()
        .integer()
        .required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fail' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const studend = await Student.findByPk(student_id);

    if (!studend) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const start_date_plan = parseISO(start_date);
    if (isBefore(start_date_plan, new Date())) {
      return res
        .status(400)
        .json({ error: 'Start date must be greater then today' });
    }

    const end_date = addMonths(start_date_plan, plan.duration);
    const price = plan.price * plan.duration;

    const enroll = await Enrolled.create({
      student_id,
      plan_id,
      start_date: start_date_plan,
      end_date,
      price,
    });

    const newEnrolled = await Enrolled.findOne({
      where: { id: enroll.id },
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'price', 'duration'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    await Queue.add(SubscriptionMail.key, {
      enroll: newEnrolled,
    });

    return res.json(newEnrolled);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .positive()
        .integer(),
      plan_id: Yup.number()
        .positive()
        .integer(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fail' });
    }

    const enroll = await Enrolled.findByPk(req.params.id);

    if (!enroll) {
      return res.status(400).json({ error: 'Enroll not found' });
    }

    const student_id = req.body.student_id || enroll.student_id;
    const plan_id = req.body.plan_id || enroll.plan_id;
    const start_date = req.body.start_date || enroll.start_date;

    const studend = await Student.findByPk(student_id);

    if (!studend) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const start_date_plan = parseISO(start_date);
    if (isBefore(start_date_plan, new Date())) {
      return res
        .status(400)
        .json({ error: 'Start date must be greater then today' });
    }

    const end_date = addMonths(start_date_plan, plan.duration);
    const price = plan.price * plan.duration;

    const enrolled = await enroll.update({
      student_id,
      plan_id,
      start_date: start_date_plan,
      end_date,
      price,
    });

    return res.json(enrolled);
  }

  async delete(req, res) {
    const { id } = req.params;

    const enroll = await Enrolled.findByPk(id);

    if (!enroll) {
      return res.status(400).json({ error: 'Enroll not found to delete' });
    }

    await enroll.destroy({
      where: { id },
    });

    return res.json({ message: 'Enroll successfully deleted' });
  }
}

export default new EnrolledController();
