import { HttpException, Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
@Injectable()
export class MailService {
    private logger = new Logger(MailService.name);

    constructor() {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    }

    async sendMail(to: string, subject: string, html: string) {
        const mailOptions = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL!,
            subject,
            html,
        };

        try {
            await sgMail.send(mailOptions);
            this.logger.log('Email sent to: ' + mailOptions.to);
        } catch (error) {
            this.logger.error('Error sending email: ', error);
            throw new HttpException("Failed to send email", 500);
        }
    }
}
