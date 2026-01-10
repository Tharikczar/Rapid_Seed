import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './modules/health/health.module';
import { TorrentsModule } from './modules/torrents/torrents.module';

@Module({
  imports: [HealthModule, TorrentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
