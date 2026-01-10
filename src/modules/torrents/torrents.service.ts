import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TorrentStatus } from './torrent-status.enum';
import { TorrentQueue } from './queue/torrent.queue';

@Injectable()
export class TorrentsService {
  constructor(private torrentQueue: TorrentQueue) {}
  private torrents = new Map<
    string,
    { id: string; magnet: string; createdAt: Date; status: string }
  >();
  //create a new torrent
  createTorrent(magnet: string) {
    if (!magnet.startsWith('magnet:')) {
      throw new BadRequestException('Invalid magnet link');
    }
    const torrentId = randomUUID();
    const newTorrent = {
      id: torrentId,
      magnet,
      createdAt: new Date(),
      status: TorrentStatus.PENDING,
    };
    this.torrents.set(torrentId, newTorrent);
    this.torrentQueue.enqueueDownload(torrentId);

    return {
      torrentId,
      status: newTorrent.status,
    };
  }
  //get torrent status
  getTorrentStatus(torrentId: string) {
    const torrent = this.torrents.get(torrentId);
    if (!torrent) {
      throw new NotFoundException('Torrent not found');
    }
    return {
      torrentId: torrent.id,
      status: torrent.status,
    };
  }
}
