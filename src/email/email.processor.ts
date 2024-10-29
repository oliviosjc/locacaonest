import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Processor('email')
export class EmailProcessor {
  constructor(private readonly mailerService: NestMailerService) { }

  @Process('sendEmail')
  async handleSendEmail(job: Job<{ to: string; subject: string; text: string }>) 
  {
    await this.mailerService.sendMail({
      to: job.data.to,
      subject: job.data.subject,
      text: job.data.text,
    });
  }
}