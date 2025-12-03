import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- SWAGGER AYARLARI BAŞLANGICI ---
  const config = new DocumentBuilder()
    .setTitle('Otopark Yönetim Sistemi API')
    .setDescription('React projesi için Backend API dokümantasyonu')
    .setVersion('1.0')
    .addTag('Otopark')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // --- SWAGGER AYARLARI BİTİŞİ ---

  // Frontend (React) bağlanabilsin diye CORS'u açıyoruz
  app.enableCors();

  await app.listen(3000);
}
bootstrap();