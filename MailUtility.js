const nodemailer = require('nodemailer');
const Mail = require('nodemailer/lib/mailer');
// let account;
// let transporter;
// (async () => {
//   account = await nodemailer.createTestAccount();
//   console.log(account);
//   transporter = nodemailer.createTransport({
//     host: account.smtp.host,
//     port: account.smtp.port,
//     secure: account.smtp.secure,
//     auth: {
//       user: account.user,
//       pass: account.pass,
//     },
//   });
// })();
class MailUtility {
  static #username = 'aizazahamd90@gmail.com';
  static #password = 'Pakistan90@';
  static #transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: this.#username,
      pass: this.#password,
    },
  });
  static getMailingHtml(response, template, data) {
    return new Promise((resolve, reject) => {
      response.render(template, data, (err, html) => {
        if (err) reject(err);
        resolve(html);
      });
    });
  }
  /**
   * @param  {Mail.Options} mailOptions
   */
  static async sendMail(mailOptions) {
    try {
      let info = await this.#transporter.sendMail(mailOptions);
      return info.accepted.length;
    } catch (e) {
      throw e;
    }
  }
}

module.exports = MailUtility;
