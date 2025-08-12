import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
import { sha256 } from 'js-sha256';

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

  // 手动实现Account ID生成
  private principalToAccountId(principal: string): string {
    try {
      // 移除principal字符串中的连字符并转换为字节
      const cleanPrincipal = principal.replace(/-/g, '');
      const principalBytes = this.base32ToBytes(cleanPrincipal);
      const subAccount = new Uint8Array(32); // 默认子账户为全0
      
      // 创建账户标识符
      const domainSeparator = new TextEncoder().encode('\x0Aaccount-id');
      const combined = new Uint8Array(domainSeparator.length + principalBytes.length + subAccount.length);
      
      combined.set(domainSeparator, 0);
      combined.set(principalBytes, domainSeparator.length);
      combined.set(subAccount, domainSeparator.length + principalBytes.length);
      
      const hash = sha256.create();
      hash.update(combined);
      const hashBytes = new Uint8Array(hash.arrayBuffer());
      
      // 计算CRC32校验和
      const crc = this.crc32(hashBytes);
      const crcBytes = new Uint8Array(4);
      crcBytes[0] = (crc >> 24) & 0xff;
      crcBytes[1] = (crc >> 16) & 0xff;
      crcBytes[2] = (crc >> 8) & 0xff;
      crcBytes[3] = crc & 0xff;
      
      // 组合CRC和哈希
      const accountId = new Uint8Array(32);
      accountId.set(crcBytes, 0);
      accountId.set(hashBytes.slice(0, 28), 4);
      
      return this.bytesToHex(accountId);
    } catch (error) {
      console.error('Error generating account ID:', error);
      return '';
    }
  }

  private base32ToBytes(base32: string): Uint8Array {
    // 简化的base32解码实现
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const bytes: number[] = [];
    let bits = 0;
    let value = 0;
    
    for (const char of base32.toUpperCase()) {
      const index = alphabet.indexOf(char);
      if (index === -1) continue;
      
      value = (value << 5) | index;
      bits += 5;
      
      if (bits >= 8) {
        bytes.push((value >> (bits - 8)) & 255);
        bits -= 8;
      }
    }
    
    return new Uint8Array(bytes);
  }

  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private crc32(data: Uint8Array): number {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
      crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  getAccountId(): string | null {
    if (!this.identity) return null;
    const principal = this.getPrincipal();
    if (!principal) return null;
    return this.principalToAccountId(principal);
  }
}

export const authService = new AuthService();