import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { DockerController } from './docker/docker.controller';

@Module({
  imports: [],
  controllers: [AppController, DockerController],
  providers: [AppService]
})
export class AppModule {}
