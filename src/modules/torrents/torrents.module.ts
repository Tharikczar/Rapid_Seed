import { Module } from '@nestjs/common';
import { TorrentsController } from './torrents.controller';
import { TorrentsService } from './torrents.service';
import { TorrentQueue } from './queue/torrent.queue';
import { MongooseModule } from '@nestjs/mongoose';
import { Torrent, TorrentSchema } from './schema/torrent.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Torrent.name, schema: TorrentSchema }]),
  ],
  controllers: [TorrentsController],
  providers: [TorrentsService, TorrentQueue],
  exports: [TorrentsService],
})
export class TorrentsModule {}
