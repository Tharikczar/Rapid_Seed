import { Worker } from 'bullmq';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Torrent } from '../schema/torrent.schema';
import { TorrentStatus } from '../torrent-status.enum';

export class TorrentWorker {
  constructor(
    @InjectModel(Torrent.name)
    private readonly torrentModel: Model<Torrent>,
  ) {
    new Worker(
      'torrent-queue',
      async (job) => {
        const { torrentId } = job.data as { torrentId: string };

        try {
          await this.torrentModel.findByIdAndUpdate(torrentId, {
            status: TorrentStatus.DOWNLOADING,
            progress: 0,
            attempts: job.attemptsMade + 1,
            error: null,
          });

          for (let progress = 10; progress <= 100; progress += 10) {
            await new Promise((r) => setTimeout(r, 700));

            // 🔥 simulate random failure
            if (Math.random() < 0.2) {
              throw new Error('Simulated download failure');
            }

            await this.torrentModel.findByIdAndUpdate(torrentId, { progress });
            await job.updateProgress(progress);
          }

          await this.torrentModel.findByIdAndUpdate(torrentId, {
            status: TorrentStatus.COMPLETED,
            progress: 100,
          });
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : 'Unknown error';
          await this.torrentModel.findByIdAndUpdate(torrentId, {
            status: TorrentStatus.FAILED,
            error: errorMessage,
            attempts: job.attemptsMade + 1,
          });

          //  IMPORTANT: rethrow error so BullMQ retries (important for backoff strategy)
          throw err;
        }
      },
      {
        connection: { url: process.env.REDIS_URL },
      },
    );
  }
}
