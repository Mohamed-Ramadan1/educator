import {
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  Contains,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({
    message: 'First name is required',
  })
  firstName: string;
  @IsNotEmpty({
    message: 'Last name is required',
  })
  lastName: string;

  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be at least 6 characters long',
  })
  @MaxLength(20, {
    message: 'Password must be at most 20 characters long',
  })
  @Contains('!', {
    message: 'Password must contain at least one special character',
  })
  password: string;
}
