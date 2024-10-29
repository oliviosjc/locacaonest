import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './email.service';
import { EmailProcessor } from './email.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'live.smtp.mailtrap.io', 
        port: 587,              
        auth: {
          user: 'api',   
          pass: '36aea0bacc1c30a3b9021da54af1330d'
        }
      },
      defaults: {
        from: '"Locação Backend" <hello@demomailtrap.com>', 
      }
    }),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailService, EmailProcessor],
  exports: [EmailService],
})
export class EmailModule {}
