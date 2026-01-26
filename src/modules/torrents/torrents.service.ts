import { Injectable, NotFoundException } from '@nestjs/common';
import { TorrentStatus } from './torrent-status.enum';
import { TorrentQueue } from './queue/torrent.queue';
import { Torrent } from './schema/torrent.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TorrentsService {
  constructor(
    @InjectModel(Torrent.name) private torrentModel: Model<Torrent>,
    private torrentQueue: TorrentQueue,
  ) {}
  //create a new torrent
  async createTorrent(magnet: string) {
    const torrent = await this.torrentModel.create({
      magnet,
      status: TorrentStatus.PENDING,
    });
    this.torrentQueue.enqueueDownload(torrent.id);

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
    };
  }
}
