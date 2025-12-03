import { PartialType } from '@nestjs/swagger';
import { CreateParkRecordDto } from './create-park-record.dto';

export class UpdateParkRecordDto extends PartialType(CreateParkRecordDto) {}
