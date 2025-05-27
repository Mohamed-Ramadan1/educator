import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { MailModule } from '@shared/mail/mail.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]), MailModule],
  exports: [],
})
export class UsersModule {}

//
