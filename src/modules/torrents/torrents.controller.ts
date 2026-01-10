import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TorrentsService } from './torrents.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Torrents')
@Controller('torrents')
export class TorrentsController {
  constructor(private torrentService: TorrentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new torrent download' })
  @ApiResponse({ status: 201, description: 'Torrent created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid magnet link' })
  createTorrent(@Body('magnet') magnet: string) {
    return this.torrentService.createTorrent(magnet);
  }

  @Get(':torrentId/status')
  @ApiOperation({ summary: 'Get torrent download status' })
  @ApiResponse({ status: 200, description: 'Torrent status fetched' })
  @ApiResponse({ status: 404, description: 'Torrent not found' })
  getTorrentStatus(@Param('torrentId') torrentId: string) {
    return this.torrentService.getTorrentStatus(torrentId);
  }
}
