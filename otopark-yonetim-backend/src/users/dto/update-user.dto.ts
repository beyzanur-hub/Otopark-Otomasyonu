import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// CreateUserDto'daki tüm özellikleri alır ama hepsini "opsiyonel" yapar.
// Yani güncelleme yaparken sadece şifreyi veya sadece ismi gönderebilirsin.
export class UpdateUserDto extends PartialType(CreateUserDto) {}