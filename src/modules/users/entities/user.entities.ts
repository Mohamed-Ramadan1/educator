// interfaces imports
import { IUser, UserRoles } from '../interfaces/index';

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user')
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100, select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRoles,
    default: UserRoles.USER,
  })
  roles: UserRoles;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'boolean', default: false })
  isPhoneVerified: boolean;

  @Column({ type: 'varchar', length: 100, nullable: true })
  emailVerificationToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerificationTokenExpiresAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  accountVerifiedAt?: Date;

  @Column({ type: 'int', default: 0 })
  resendVerificationTokenCount?: number;

  @Column({ type: 'timestamp', nullable: true })
  lastResendVerificationTokenAt?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  accountRecoveryEmail?: string;

  @Column({ type: 'boolean', default: true })
  notificationAllowed: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
