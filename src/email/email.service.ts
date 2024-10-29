import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class EmailService {
    constructor(@InjectQueue('email') private emailQueue: Queue) {}

    async addEmailToQueue(emailData: { to: string; subject: string; text: string }) 
    {
        await this.emailQueue.add('sendEmail', emailData);
    }
}
