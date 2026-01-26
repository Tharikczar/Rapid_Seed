import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateTorrentDto {
  @ApiProperty({
    example: 'magnet:?xt=urn:btih:example',
    description: 'Magnet link of the torrent',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^magnet:\?/, {
    message: 'Magnet link must start with magnet:?',
  })
  magnet: string;
}
