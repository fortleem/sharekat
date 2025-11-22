import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { InvestmentsModule } from './investments/investments.module';
import { PaymentsModule } from './payments/payments.module';
import { DocsModule } from './docs/docs.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AiModule } from './ai/ai.module';
import { AiderModule } from './aider/aider.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    AuthModule, UsersModule, ProjectsModule, InvestmentsModule,
    PaymentsModule, DocsModule, NotificationsModule, AiModule, AiderModule, CommonModule
  ],
})
export class AppModule {}
