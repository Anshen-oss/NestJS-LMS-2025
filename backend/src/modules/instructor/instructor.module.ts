import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { InstructorResolver } from './instructor.resolver';
import { InstructorService } from './instructor.service';

@Module({
  imports: [PrismaModule],
  providers: [InstructorResolver, InstructorService],
  exports: [InstructorService],
})
export class InstructorModule {}
