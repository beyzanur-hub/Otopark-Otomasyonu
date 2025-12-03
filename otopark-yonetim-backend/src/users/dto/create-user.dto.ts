import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Ahmet Yılmaz', description: 'Kullanıcının tam adı' })
  fullName: string;

  @ApiProperty({ example: 'ahmet@mail.com', description: 'Kullanıcının e-posta adresi' })
  email: string;

  @ApiProperty({ example: '123456', description: 'Giriş şifresi' })
  password: string;

  // Rolü admin/customer olarak otomatik atayacağız, buraya eklemeye gerek yok.
}