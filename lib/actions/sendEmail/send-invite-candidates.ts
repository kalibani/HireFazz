import { Resend } from 'resend';
import EmailTemplateCandidates from '@/components/email-template/email-template-candidates';
import { render } from '@react-email/render';

export const sendInviteCandidate = async (
  name: string,
  email: string,
  id: string,
  title: string,
  from: string,
  subject: string,
  keyCode: string,
) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const link = `https://dev.berrylabs.io/candidate/?id=${id}`;

    const response = await resend.emails.send({
      from,
      to: email,
      subject,
      // @ts-ignore
      html: render(EmailTemplateCandidates({ name, title, link, keyCode })),
    });

    return response;
  } catch (error) {
    console.error('Error in sendInviteCandidate:', error);
    throw error;
  }
};
