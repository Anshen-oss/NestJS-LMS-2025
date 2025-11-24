import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { EnrollmentResolver } from './enrollment.resolver';
import { EnrollmentService } from './enrollment.service';

@Module({
  imports: [PrismaModule],
  providers: [EnrollmentResolver, EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
