import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { VideoProgressResolver } from './video-progress.resolver';
import { VideoProgressService } from './video-progress.service';

@Module({
  imports: [PrismaModule],
  providers: [VideoProgressResolver, VideoProgressService],
  exports: [VideoProgressService], // Permet d'utiliser le service dans d'autres modules
})
export class VideoProgressModule {}
