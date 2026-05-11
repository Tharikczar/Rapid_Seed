import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TorrentStatus } from '../torrent-status.enum';

@Schema({ timestamps: true })
export class Torrent extends Document {
  @Prop({ required: true })
  magnet!: string;

  @Prop({
    type: String,
    enum: TorrentStatus,
    default: TorrentStatus.PENDING,
  })
  status!: TorrentStatus;

  @Prop({ type: Number, default: 0 })
  progress!: number;

  @Prop({ type: Number, default: 0 })
  attempts!: number;
  @Prop({ type: String, default: null })
  error!: string | null;
}

export const TorrentSchema = SchemaFactory.createForClass(Torrent);
