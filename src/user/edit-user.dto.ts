import { IsEmail, IsString } from 'class-validator';

export class EditUserDto {
  @IsEmail()
  email?: string;
  @IsString()
  firstName?: string;
  @IsString()
  lastName?: string;
}
