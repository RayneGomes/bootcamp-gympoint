import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpAnswer {
  get key() {
    return 'HelpAnswer';
  }

  async handle({ data }) {
    const { help } = data;

    await Mail.sendMail({
      to: `${help.student.name} <${help.student.email}>`,
      subject: 'Resposta a sua dúvida',
      template: 'HelpAnswer',
      context: {
        student: help.student.name,
        question: help.question,
        answer: help.answer,
        date_answer: format(
          parseISO(help.answer_at),
          "dd 'de' MMMM 'de' yyyy 'às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new HelpAnswer();
