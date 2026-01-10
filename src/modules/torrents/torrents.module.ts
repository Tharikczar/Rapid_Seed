import { Module } from '@nestjs/common';
import { TorrentsController } from './torrents.controller';
import { TorrentsService } from './torrents.service';
import { TorrentQueue } from './queue/torrent.queue';

@Module({
  controllers: [TorrentsController],
  providers: [TorrentsService, TorrentQueue],
  exports: [TorrentsService],
})
export class TorrentsModule {}
