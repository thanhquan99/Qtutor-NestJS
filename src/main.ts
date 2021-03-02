import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as CONFIG from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = CONFIG.get('server');
  const config = new DocumentBuilder()
    .setTitle('Cinema Api')
    .setDescription('The Cinema API')
    .setVersion('1.0')
    .addTag('cinemas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  await app.listen(process.env.PORT || serverConfig.port);
}
bootstrap();
