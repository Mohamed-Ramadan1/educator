import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mailerOptions } from '@config/index';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport(mailerOptions);

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
