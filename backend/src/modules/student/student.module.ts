import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { StudentResolver } from './student.resolver';
import { StudentService } from './student.service';

@Module({
  imports: [PrismaModule],
  providers: [StudentResolver, StudentService],
  exports: [StudentService],
})
export class StudentModule {}
