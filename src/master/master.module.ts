import { Module } from '@nestjs/common';
import { MasterJabatan, MasterVendor } from './master.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterVendorService } from './master.service';
import { MasterVendorController } from './master.controller';


@Module({
    imports: [
      TypeOrmModule.forFeature([MasterVendor, MasterJabatan]),  
    ], // Daftarkan entity
    providers: [MasterVendorService],
    controllers: [MasterVendorController],
  })
  export class MasterModule {}
  