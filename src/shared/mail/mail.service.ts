import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mailerOptions } from '@config/index';

@Injectable()
export class MailService {
  // private transporter = nodemailer.createTransport(mailerOptions);
  private readonly logger = new Logger(MailService.name);
  private transporter = nodemailer.createTransport(mailerOptions);

  async onModuleInit() {
    try {
      // console.log(mailerOptions);
      await this.transporter.verify();
      this.logger.log('SMTP connection verified successfully');
    } catch (error) {
      this.logger.error('SMTP connection failed:', error.message);
      throw new Error('Failed to initialize mail service');
    }
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    if (!to || !subject || !text) {
      throw new Error('Missing required email parameters');
    }
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
      // Consider throwing a custom exception with more context
      throw new Error(`Failed to send email to ${to}: ${error.message}`);
    }
  }
}
