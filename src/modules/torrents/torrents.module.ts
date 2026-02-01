import { Module } from '@nestjs/common';
import { TorrentsController } from './torrents.controller';
import { TorrentsService } from './torrents.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Torrent, TorrentSchema } from './schema/torrent.schema';
import { torrentQueueProvider } from './queue/torrent-queue.provider';
import { TorrentWorker } from './worker/torrent.worker';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Torrent.name, schema: TorrentSchema }]),
  ],
  controllers: [TorrentsController],
  providers: [TorrentsService, torrentQueueProvider, TorrentWorker],
  exports: [TorrentsService],
})
export class TorrentsModule {}
