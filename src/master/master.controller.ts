import { MasterVendorService } from "./master.service";
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../middleware/header.middleware';
import { createResponse } from 'src/pkg/response.utils';
import { MasterVendor } from "./master.entity";
import { classToPlain } from 'class-transformer';


@Controller('master')
export class MasterVendorController {
  constructor(
    private readonly masteService: MasterVendorService, 
  ) {}

  @Get("vendor")
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<any> {
    const master: MasterVendor[] = await this.masteService.findAll(1);
    if (master.length<= 0) {
      return createResponse("error", "Data master vendor kosong", null);
    }
   
    return createResponse("success", "data retrieved", classToPlain(master));
  }

  @Get("jabatan")
  @UseGuards(JwtAuthGuard)
  async findAllJabatan(): Promise<any> {
    const master: MasterVendor[] = await this.masteService.findAllJabatan(1);
    if (master.length<= 0) {
      return createResponse("error", "Data master jabatan kosong", null);
    }
   
    return createResponse("success", "data retrieved", classToPlain(master));
  }
  
}