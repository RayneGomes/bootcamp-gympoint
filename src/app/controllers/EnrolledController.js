import Enroled from '../models/Enrolled';

class EnrolledController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const limitPage = 20;

    const enroleds = await Enroled.findAll({
      order: ['start_date'],
      limit: limitPage,
      offset: (page - 1) * limitPage,
    });

    return res.json(enroleds);
  }
}

export default new EnrolledController();
