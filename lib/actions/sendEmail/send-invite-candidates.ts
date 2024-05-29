import EmailTemplateCandidates from '@/components/email-template/email-template-candidates';
import { errorHandler } from '@/helpers';
import { Resend } from 'resend';

export const sendInviteCandidate = async (
  name: string,
  email: string,
  id: string,
  from: string,
  subject: string,
) => {
  try {
    const domain = process.env.NEXT_PUBLIC_APP_URL;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const interviewLink = `${domain}/candidate/?id=${id}`;
    const { data, error } = await resend.emails.send({
      from,
      to: email,
      subject,
      //@ts-ignore
      react: EmailTemplateCandidates(name, interviewLink) as React.ReactElement,
    });

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    errorHandler(error);
  }
};
