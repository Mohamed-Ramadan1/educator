import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
@Processor('auth')
export class AuthProcessor {
  @Process('login')
  async handleLogin(job: Job): Promise<void> {
    // Here you would handle the login logic, such as validating the user credentials
    // and generating a JWT token or performing any other necessary actions.
    console.log('Processing login job:', job.data);

    // Simulate some processing time
    console.log(job.attemptsMade, job.attemptsMade, job.data);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log('Login job processed successfully for user:', job.data.userId);
  }
}
