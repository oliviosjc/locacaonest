import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from 'src/auth/auth.module';
import { CreateAccountCommandHandler } from './handlers/create-account.handler';
import { OnboardingController } from './onboarding.controller';

@Module({
    imports: [CqrsModule, AuthModule],
    providers: [CreateAccountCommandHandler],
    controllers: [OnboardingController]
})
export class OnboardingModule {}
