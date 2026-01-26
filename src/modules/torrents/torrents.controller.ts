import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TorrentsService } from './torrents.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTorrentDto } from './dto/create-torrent.dto';
@ApiTags('Torrents')
@Controller('torrents')
export class TorrentsController {
  constructor(private torrentService: TorrentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new torrent download' })
  @ApiResponse({ status: 201, description: 'Torrent created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid magnet link' })
  createTorrent(@Body() dto: CreateTorrentDto) {
    return this.torrentService.createTorrent(dto.magnet);
  }

  @Get(':torrentId/status')
  @ApiOperation({ summary: 'Get torrent download status' })
  @ApiResponse({ status: 200, description: 'Torrent status fetched' })
  @ApiResponse({ status: 404, description: 'Torrent not found' })
  getTorrentStatus(@Param('torrentId') torrentId: string) {
    return this.torrentService.getTorrentStatus(torrentId);
  }
}
