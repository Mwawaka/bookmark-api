import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }
  cleanDb() {
    // transaction ensures that prisma carries out its function in a specified order
    return this.$transaction([
      this.user.deleteMany(),
      this.bookmark.deleteMany(),
    ]);
  }
}
