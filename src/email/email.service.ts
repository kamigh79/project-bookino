import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
  }

  async send(to: string, subject: string, body: string) {
    await this.transporter.sendMail({
      from: process.env.USER,
      to: to,
      subject: subject,
      html: body,
    });
  }
}
