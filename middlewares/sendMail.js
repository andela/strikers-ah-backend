import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const sender = (to, subject, message) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: 'harfrank2@gmail.com',
    subject,
    text: message,
    html: '<strong>email fired up</strong>',
  };
  sgMail.send(msg);
  return 'success';
};
export default sender;
