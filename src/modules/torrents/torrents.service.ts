import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TorrentStatus } from './torrent-status.enum';
import { Torrent } from './schema/torrent.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Queue } from 'bullmq';
import { TORRENT_QUEUE } from './queue/torrent-queue.provider';

@Injectable()
export class TorrentsService {
  constructor(
    @InjectModel(Torrent.name) private torrentModel: Model<Torrent>,
    @Inject(TORRENT_QUEUE)
    private readonly torrentQueue: Queue,
  ) {}
  //create a new torrent
  async createTorrent(magnet: string) {
    const torrent = await this.torrentModel.create({
      magnet,
      status: TorrentStatus.PENDING,
    });
    await this.torrentQueue.add(
      'download-torrent',
      { torrentId: torrent.id },
      {
        attempts: 5,
        backoff: { type: 'exponential', delay: 60000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    return {
      torrentId: torrent.id,
      status: torrent.status,
    };
  }
  //get torrent status
  async getTorrentStatus(torrentId: string) {
    const torrent = await this.torrentModel.findById(torrentId);
    if (!torrent) {
      throw new NotFoundException('Torrent not found');
    }
    return {
      torrentId: torrent.id,
      status: torrent.status,
      progress: torrent.progress,
    };
  }
}
