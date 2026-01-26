import { ApiProperty } from '@nestjs/swagger';
import { TorrentStatus } from '../torrent-status.enum';

export class TorrentStatusResponseDto {
  @ApiProperty()
  torrentId: string;

  @ApiProperty({ enum: TorrentStatus })
  status: TorrentStatus;
}
