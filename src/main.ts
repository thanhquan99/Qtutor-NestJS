import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as CONFIG from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const serverConfig = CONFIG.get('server');
  const config = new DocumentBuilder()
    .setTitle('Cinema Api')
    .setDescription(
      `## Query
    filter = {"releaseDate":{"gte": "2020-03-01"}, "name":{"equal": "Quan"}, "email": {"like": "quan@gmail.com"}, "name":{"in": ["Quan", "Sang"]}}
    orderBy = {"id": "ASC", "name":"DESC"}
    page = 1
    perPage = 10
    relations = 'actors,genres,directors' (GET /movies)
    relations = 'userRole,userRole.role' (GET /users)
    
    ## Operator
    _ equal: =
    _ notequal: !=
    _ gt: >
    _ gte: >=
    _ lt: <
    _ lte: <=
    _ in: in array
    
    ## Data
    {
     total,
     results:[object]
    }
    
    ## Relation
    _ One To Many
    "cinema":{
    "name",
    "address",
    "theaters":[Object]
    }
    
    _ One To One
    "user":{
    "name",
    "age",
    "profile": Object
    }`,
    )
    .setVersion('1.0')
    .addTag('cinemas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();
  await app.listen(process.env.PORT || serverConfig.port);
}
bootstrap();
