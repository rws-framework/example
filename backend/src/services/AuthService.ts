// deepgram-live.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IUser from '../models/interfaces/IUser';
import User from '../models/User';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

export type AuthResponse<T> = {
  success: boolean,
  user: T | null,
  token: string | null
}

export type DecodedToken = {
  sub: string,
  username: string,
  iat: number,
  exp: number
}

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);
  constructor(private configService: ConfigService) {}

  private JWT_SECRET: string
  private JWT_EXPIRATION: number

  async onModuleInit() {
    this.JWT_SECRET = this.configService.get('secret_key');
    this.JWT_EXPIRATION = this.configService.get('jwt_expiration_days');

    this.logger.log('Auth service initialized');
  }

  async authenticate(login: string, passwd: string): Promise<AuthResponse<IUser>>
  {
    try {
      const user: IUser = await User.findOneBy({
        conditions: {
          username: login
        },
        fullData: true
      });

      if(!user){
        console.error('No user', login);
        return {
          success: false,
          token: null,
          user: null
        }
      }

      
      // Verify password
      const isPasswordValid = await this.verifyPassword(passwd, user.passwd);

      if (!isPasswordValid) {
        console.error('Invalid password for user', login);
          return {
              success: false,
              token: null,
              user: null
          };
      }

      // Generate JWT token
      const token = this.generateToken(user);


      // Remove password from user object before sending
      const { passwd: _, ...userWithoutPassword } = user;

      return {
          success: true,
          token: token,
          user: userWithoutPassword as IUser
      };
    }
    catch(error: Error | any){
      console.error('Authentication error:', error);
      return {
          success: false,
          token: null,
          user: null
      };
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = this.JWT_SECRET;
    // Hash the password with the salt using SHA256
    const hash = crypto.createHash('sha256')
      .update(password + salt)
      .digest('hex');
    // Combine salt and hash with a separator
    return `${salt}:${hash}`;
  }

  // Helper method to verify passwords
  private async verifyPassword(plainPassword: string, storedHash: string): Promise<boolean> {
    try {      
      const computedHash = await this.hashPassword(plainPassword);
      return computedHash === storedHash;
    } catch (error) {
      this.logger.error('Password verification failed:', error);
      return false;
    }
  }

  // Generate JWT token
  generateToken(user: IUser): string {
    const expirationInSeconds = this.JWT_EXPIRATION * 24 * 60 * 60;

    return jwt.sign(
      {
        sub: user.id,
        username: user.username
      },
      this.JWT_SECRET,
      {
        expiresIn: expirationInSeconds
      }
    );
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      return null;
    }
  }

  async decodeToken(token: string): Promise<DecodedToken | null> {
    try {
      // Verify and decode the token
      const decoded = await this.verifyToken(token);
      if (!decoded) {
        return null;
      }

      return decoded as DecodedToken;
    } catch (error) {
      this.logger.error('Token decoding failed:', error);
      return null;
    }
  }

  // Get user data from token
  async getUserFromToken(token: string): Promise<IUser | null> {
    try {
      const decoded = await this.decodeToken(token);
      if (!decoded) {
        return null;
      }

      // Find user by id from decoded token
      const user = await User.findOneBy({
        conditions: {
          id: decoded.sub
        },
        fullData: true
      });

      if (!user) {
        return null;
      }

      user.passwd = null;
      
      return user;

    } catch (error) {
      this.logger.error('Failed to get user from token:', error);
      return null;
    }
  }
}