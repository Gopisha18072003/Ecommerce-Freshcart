const nodemailer = require('nodemailer');
const {htmlToText} = require('html-to-text');
const pug = require('pug')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Freshcart <${process.env.USER_EMAIL}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        port: 587,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      auth: {
        user:  process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject, data) {
    // 1) Render HTML based on a pug template
    console.log("Reset URL: ", this.url);
    const html = pug.renderFile(`${__dirname}/../templates/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
      data
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html)
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', "Welcome to the Freshcart's Family!");
  }

  async sendInvoice(order) {
    await this.send('invoice', 'Confirmation for your order', order);
  } 
  
  async sendAdminInvoice(order) {
    await this.send('adminInvoice', 'New order placed', order);
  } 

  async sendPasswordReset() {
    await this.send(
      'resetPassword',
      'Reset your password'
    );
  }

  async sendSupportMessage(data) {
    await this.send(
      'support',
      'Urgent Assistance Needed',
      data
    )
  }
};
