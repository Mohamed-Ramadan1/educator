import { IsEmail, IsNotEmpty } from 'class-validator';
import nodemailer from 'nodemailer';
export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  body: string;

  html?: string;

  attachments?: nodemailer.SendMailOptions['attachments'];
}
