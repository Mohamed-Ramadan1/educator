import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailDto } from './dto/sendEmailDTO';
import { EmailException } from '../../common/exceptions';
import * as nodemailer from 'nodemailer';
import { Logger } from '@nestjs/common';
import { validate } from 'class-validator';

@Injectable()
export class EmailServiceService implements OnModuleDestroy {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailServiceService.name);

  constructor(private readonly configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter(): void {
    // eslint-disable-next-line no-useless-catch
    try {
      const emailPort = this.configService.get<string>('EMAIL_PORT');
      const port = emailPort ? parseInt(emailPort, 10) : 587;

      // Validate port number
      if (isNaN(port) || port < 1 || port > 65535) {
        throw new Error(`Invalid EMAIL_PORT: ${emailPort}`);
      }

      this.transporter = nodemailer.createTransport({
        host: this.configService.get<string>('EMAIL_HOST', 'smtp.gmail.com'),
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
          user: this.configService.get<string>('EMAIL_USER'),
          pass: this.configService.get<string>('EMAIL_PASSWORD'),
        },
        tls: {
          rejectUnauthorized:
            this.configService.get<string>('NODE_ENV') === 'production',
        },
        pool: true, // Use connection pooling
        maxConnections: 5,
        maxMessages: 100,
      });
    } catch (error) {
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      this.logger.log('Email connection verified successfully');
      return true;
    } catch (error) {
      this.logger.error('Email connection verification failed', error);
      return false;
    }
  }

  async sendEmail(
    emailData: SendEmailDto,
  ): Promise<nodemailer.SentMessageInfo> {
    // Validate input
    const dto = Object.assign(new SendEmailDto(), emailData);
    const validationErrors = await validate(dto);

    if (validationErrors.length > 0) {
      const errorMessages = validationErrors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join('; ');
      throw new EmailException.EmailValidationError(
        `Validation failed: ${errorMessages}`,
      );
    }

    const { to, subject, body, html, attachments } = emailData;

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.getFromAddress(),
      to,
      subject,
      text: body,
      html: html || this.generateHtmlFromText(body),
      attachments,
    };

    try {
      this.logger.log(`Sending email to: ${to}, Subject: ${subject}`);

      const result = await this.transporter.sendMail(mailOptions);

      this.logger.log(
        `Email sent successfully to ${to}. MessageId: ${result.messageId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error);
      throw new EmailException.EmailSendError(
        `Failed to send email to ${to}`,
        error,
      );
    }
  }

  private getFromAddress(): string {
    const emailFrom = this.configService.get<string>(
      'EMAIL_FROM',
      'educatorPlatform148@gmail.com',
    );
    const siteName = this.configService.get<string>(
      'SITE_OFFICIAL_NAME',
      'Educator Platform',
    );
    return `"${siteName}" <${emailFrom}>`;
  }

  private generateHtmlFromText(text: string): string {
    // Convert line breaks to HTML and wrap in basic HTML structure
    const htmlContent = text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>${htmlContent}</p>
        </body>
      </html>
    `;
  }

  private stripHtmlTags(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  onModuleDestroy(): void {
    if (this.transporter) {
      this.transporter.close();
      this.logger.log('Email transporter connection closed');
    }
  }
}
