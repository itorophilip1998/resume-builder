import { Module } from '@nestjs/common';
import { ResumeModule } from './resume/resume.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration globally accessible
    }),
    ResumeModule,
  ],
})
export class AppModule {}
