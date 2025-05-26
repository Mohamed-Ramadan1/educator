import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entities';

@Injectable()
export class UserRepository extends Repository<User> {
  // constructor() {}
}
