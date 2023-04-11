import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { getEnvPath } from './common/helper/env.helper';
 
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [AuthModule, PrismaModule,ConfigModule.forRoot({ envFilePath, isGlobal: true })],
})
export class AppModule {}