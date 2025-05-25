import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [],
})
export class UsersModule {}
