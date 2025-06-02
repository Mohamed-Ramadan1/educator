export interface IAuthService {
  registerUser(): Promise<void>;
  loginUser(): Promise<void>;
}
