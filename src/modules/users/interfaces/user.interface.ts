export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  Instructor = 'instructor',
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  roles: UserRoles;
  phoneNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpiresAt?: Date;
  accountVerifiedAt?: Date;
  resendVerificationTokenCount?: number;
  lastResendVerificationTokenAt?: Date;
  accountRecoveryEmail?: string;
  notificationAllowed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
