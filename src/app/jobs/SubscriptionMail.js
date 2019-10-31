import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { enroll } = data;

    await Mail.sendMail({
      to: `${enroll.student.name} <${enroll.student.email}>`,
      subject: 'Bem vindo a GymPoint',
      template: 'subscription',
      context: {
        student: enroll.student.name,
        plan: enroll.plan.title,
        price: `R$ ${enroll.price}`,
        end_date: format(enroll.end_date, "dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
      },
    });
  }
}

export default new SubscriptionMail();
