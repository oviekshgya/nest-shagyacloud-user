import { MasterVendor } from "./master.entity";
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class MasterVendorService {
  constructor(
    @InjectRepository(MasterVendor)
    private readonly masterVendorRepository: Repository<MasterVendor>,
  ) {}

  findAll(isActive: number): Promise<MasterVendor[]> {
    return this.masterVendorRepository.find({
      where: { isActive }, // Filter dinamis berdasarkan isActive
    });
  }

}