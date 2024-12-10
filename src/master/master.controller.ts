import { MasterVendorService } from "./master.service";
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../middleware/header.middleware';
import { createResponse } from 'src/pkg/response.utils';
import { MasterVendor } from "./master.entity";



@Controller('master')
export class MasterVendorController {
  constructor(
    private readonly masteService: MasterVendorService, 
  ) {}

  @Get("vendor")
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<any> {
    const master: MasterVendor[] = await this.masteService.findAll();
   
    return createResponse("success", "data retrieved", master);
  }
  
}