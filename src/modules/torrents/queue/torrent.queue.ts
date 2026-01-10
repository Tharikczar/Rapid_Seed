import { Injectable } from '@nestjs/common';

@Injectable()
export class TorrentQueue {
  enqueueDownload(torrentId: string) {
    /**
     * In real implementation:
     * - This will push a job to BullMQ / Redis
     * - Worker will pick it up asynchronously
     */
    console.log(`[QUEUE] Enqueued download job for torrent ${torrentId}`);
  }
}
