import { Controller } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import {
  Get,
  Post,
} from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { OffersService } from './offers.service';

@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}
  @Get()
  async getAllOffers() {
    return await this.offersService.findAllOffers();
  }

  @Get(':id')
  async getOffer(@Body('id') id: number) {
    return await this.offersService.findOfferById(id);
  }

  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Req() currentUser,
  ) {
    return await this.offersService.createOffer(currentUser.user, {
      ...createOfferDto,
      hidden: false,
    });
  }
}
