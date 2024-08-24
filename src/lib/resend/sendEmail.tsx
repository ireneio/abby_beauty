import { Resend } from 'resend';
import ReactDOMServer from 'react-dom/server';
import Welcome from '../../../emails/Welcome';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendTrialsReservationEmail = async (
  {
    to,
  }: {
    to: string
  }
) => {
    const emailHtml = ReactDOMServer.renderToStaticMarkup(
      <Welcome />
    );
    
    const response = await resend.emails.send({
      from: "艾比美容工作室 <onboarding@resend.dev>",
      to,
      subject: "艾比美容工作室 | 課程預約體驗通知",
      // html: emailHtml,
      react: React.createElement(Welcome)
    });
    
    return response;
}
