'use server';

import { Resend } from 'resend';
export type TEmail = {
  from: string;
  to: Array<string>;
  subject: string;
  html: string;
};

const resend = new Resend(process.env.RESEND_API_KEY);

const sendingEmail = async ({ from, to, subject, html }: TEmail) =>
  await resend.emails
    .send({
      from,
      to,
      subject,
      html,
    })
    .then((data) => data);

export { sendingEmail };
