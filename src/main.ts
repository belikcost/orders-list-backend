import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
  console.log('App is listening on port 3000!')
}
bootstrap()
