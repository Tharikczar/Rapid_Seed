import { Queue } from 'bullmq';

export const TORRENT_QUEUE = 'TORRENT_QUEUE';

export const torrentQueueProvider = {
  provide: TORRENT_QUEUE,
  useFactory: () => {
    return new Queue('torrent-queue', {
      connection: {
        url: process.env.REDIS_URL,
      },
    });
  },
};