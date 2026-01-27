import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private logger = new Logger(MailService.name);

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_GOOGLE_APP_EMAIL,
                pass: process.env.MAIL_GOOGLE_APP_PASSWORD,
            },
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        const mailOptions = {
            from: process.env.MAIL_GOOGLE_APP_EMAIL,
            to,
            subject,
            html,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            this.logger.log('Email sent: ' + info.response);
        } catch (error) {
            this.logger.error('Error sending email: ', error);
            throw new HttpException("Failed to send email", 500);
        }
    }
}
