import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend
  app.enableCors({
    origin: 'http://localhost:8000', // Your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Backend is running on http://localhost:${port}`);
  console.log(`🌐 CORS enabled for: http://localhost:8000`);
  console.log(`📡 API Endpoints available:`);
  console.log(`   GET    /employees`);
  console.log(`   POST   /employees`);
  console.log(`   DELETE /employees/:id`);
  console.log(`   GET    /tax-brackets`);
  console.log(`   POST   /calculate-tax/:employeeId`);
}
bootstrap();
