import ReactDOMServer from 'react-dom/server';
import React from 'react';
import Mailgun from 'mailgun.js'
import formData from 'form-data';
import AdminReservation from './templates/AdminReservation';

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY! });

export const sendAdminTrialsReservationEmail = async (
  {
    to,
    message,
  }: {
    to: string
    message: any
  }
) => {
    const emailHtml = ReactDOMServer.renderToStaticMarkup(<AdminReservation message={message} />);
    const response = await mg.messages.create('sandboxb57f1649f24541ac87f6f283b1998cb0.mailgun.org', {
      from: "艾比美容中心 <mailgun@sandboxb57f1649f24541ac87f6f283b1998cb0.mailgun.org>",
      to: [to],
      subject: "艾比美容中心 | 體驗課程預約通知",
      html: emailHtml,
    })
    return response;
}
