import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() //makes the module global based so thaat other modules need not to import the module manually
@Module({
  providers: [PrismaService],
  exports: [PrismaService], //ensures that the service is accessible to other modules
})
export class PrismaModule {}
