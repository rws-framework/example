import { IUserCreateApiPayload, IUserCreateApiResponse, IUserDeleteApiResponse, IUserListApiResponse, IUserCreateKeyApiResponse } from './response-types/IUserApiResponse';
import { Body } from '@nestjs/common';
import IUser from '../models/interfaces/IUser';
import { Param } from '@nestjs/common';
import { createHash } from 'crypto';
import { AuthService } from '../services/AuthService';
import ApiKey from '../models/ApiKey';
import { v4 as uuid } from 'uuid';

import User from '../models/User';


import { RWSRoute, RWSController } from '@rws-framework/server/nest';
import { Auth, AuthUser } from '../guards/auth.guard';

@RWSController('user')
export class UserController { 
    private readonly SALT_ROUNDS = 10;
  
    constructor(private authService: AuthService){}


    @RWSRoute('user.index')
    @Auth()
    async index(@AuthUser() loggedUser: User): Promise<IUserListApiResponse>
    {
        const users: IUser[] = await User.findBy();
        return { data: users }
    }

    
    @RWSRoute('user.create')
    @Auth()
    async create(        
      @Body() body: IUserCreateApiPayload
    ): Promise<IUserCreateApiResponse> {    
      
      if(body.passwd !== body.r_passwd){
        return {
          success: false,
          data: 'Passwords do not match'
        };
      }

      if(await User.findOneBy({ conditions: {username: body.username }})){
        return {
          success: false,
          data: 'User already exists'
        };
      }
      
      const hashedPassword: string = await this.authService.hashPassword(body.passwd);

      const user: User = new User({
        username: body.username,
        passwd: hashedPassword,          
        active: true
      });

      await user.save();

      return {
        success: true,
        data: user
      };
    }

    @RWSRoute('user.createkey')
    @Auth()
    async createKey(        
      @Param('id') id: string
    ): Promise<IUserCreateKeyApiResponse> {    
  

      const user: User = await User.find(id);         

      const keyModel: ApiKey = new ApiKey({ keyval: 're-' + uuid() });
      keyModel.user = user;
      
      await keyModel.save();            

      return {
        success: true,
        data: keyModel
      };
    }

    @RWSRoute('user.delete')
    @Auth()
    async delete(@Param('id') id: string): Promise<IUserDeleteApiResponse> {                      
        await User.delete({ id })

        return {
          success: true
        }
    } 
    
    @RWSRoute('user.deletekey')
    @Auth()
    async deleteKey(@Param('id') id: string): Promise<IUserDeleteApiResponse> {                      
        await ApiKey.delete({ id })

        return {
          success: true
        }
    }  
}
