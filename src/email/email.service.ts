import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: NestMailerService) { }

    async sendMail(to: string, subject: string, text: string) {
        try {
            await this.mailerService.sendMail({
                to,
                subject,
                text,
            });
            return { message: 'E-mail enviado com sucesso' };
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error);
            throw new Error('Falha ao enviar e-mail');
        }
    }
}
