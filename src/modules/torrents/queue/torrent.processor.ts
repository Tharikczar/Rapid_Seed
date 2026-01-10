export class TorrentProcessor {
  /**
   * This will run in a separate worker process later.
   * Never inside controllers.
   */
  async processDownload(torrentId: string) {
    console.log(`[WORKER] Processing torrent ${torrentId}`);

    /**
     * Steps (future):
     * 1. Update status → DOWNLOADING
     * 2. Download torrent
     * 3. Save files to storage
     * 4. Update status → COMPLETED / FAILED
     */
    return Promise.resolve();
  }
}
