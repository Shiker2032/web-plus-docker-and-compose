import { Controller, Req } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/';
import { UseGuards, UseInterceptors } from '@nestjs/common/decorators';
import { ClassSerializerInterceptor } from '@nestjs/common/serializer';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './local.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @Post('signUp')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return await this.authService.auth(user);
  }

  @UseGuards(LocalGuard)
  @Post('signIn')
  async signIn(@Req() req) {
    return this.authService.auth(req.user);
  }
}
