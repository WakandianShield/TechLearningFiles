import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('UPLOAD_DIR', './uploads'),
          filename: (_req, file, cb) => {
            const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
            cb(null, uniqueName);
          },
        }),
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB for images
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
