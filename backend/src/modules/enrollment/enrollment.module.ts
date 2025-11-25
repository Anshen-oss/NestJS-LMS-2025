import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentResolver } from './enrollment.resolver';
import { EnrollmentService } from './enrollment.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [EnrollmentResolver, EnrollmentService],
  controllers: [EnrollmentController],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
