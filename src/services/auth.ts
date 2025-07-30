import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';

class AuthService {
  private authClient: AuthClient | null = null;
  private identity: Identity | null = null;

  async init(): Promise<void> {
    this.authClient = await AuthClient.create();
    
    if (await this.authClient.isAuthenticated()) {
      this.identity = this.authClient.getIdentity();
    }
  }

  async login(): Promise<boolean> {
    if (!this.authClient) {
      await this.init();
    }

    return new Promise((resolve) => {
      // 使用固定的Internet Identity URL，避免process.env问题
      const identityProvider = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:4943?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai'
        : 'https://identity.ic0.app/#authorize';

      this.authClient!.login({
        identityProvider,
        onSuccess: () => {
          this.identity = this.authClient!.getIdentity();
          resolve(true);
        },
        onError: (error) => {
          console.error('Login failed:', error);
          resolve(false);
        },
      });
    });
  }

  async logout(): Promise<void> {
    if (this.authClient) {
      await this.authClient.logout();
      this.identity = null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.authClient) {
      return false;
    }
    return await this.authClient.isAuthenticated();
  }

  getIdentity(): Identity | null {
    return this.identity;
  }

  getPrincipal(): string | null {
    return this.identity?.getPrincipal().toString() ?? null;
  }
}

export const authService = new AuthService();