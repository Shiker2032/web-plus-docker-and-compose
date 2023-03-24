import { IsEmail, IsString, IsUrl, Length } from 'class-validator';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 64)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 64)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @Length(1, 64)
  email: string;

  @IsOptional()
  @Length(0, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;
}
