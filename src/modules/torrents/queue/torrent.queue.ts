import { Queue } from 'bullmq';

export const TorrentQueue = new Queue('torrent-queue', {
  connection: {
    url: process.env.REDIS_URL,
  },
});
