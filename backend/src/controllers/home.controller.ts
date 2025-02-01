import { AuthService } from '../services/AuthService';
import { Body } from '@nestjs/common';
import { IUserLoginApiResponse } from './response-types/IHomeApiResponse'
import { RWSRoute, RWSController } from '@rws-framework/server/nest';
import IUser from '../models/interfaces/IUser';
import User from '../models/User';

type ITalkApiResponse = {
    success: boolean
    data: { wsId: string, response: string, error?: Error | any }
};

@RWSController('home')
export class HomeController {   
    constructor(private authService: AuthService){}

    @RWSRoute('home.login')    
    async process(        
        @Body() body: { username: string, passwd: string }
    ): Promise<IUserLoginApiResponse> {
        
        try {
            // Validate input
            if (!body.username || !body.passwd) {
                return {
                    success: false,
                    data: null,
                    error: 'Username and password are required'
                };
            }
    
            // Authenticate user
            const authResult = await this.authService.authenticate(body.username, body.passwd);
            
            if (!authResult.success) {
                return {
                    success: false,
                    data: null,
                    error: 'Invalid credentials'
                };
            }

            // Return successful login response with user data and token
            return {
                success: true,
                data: {
                    user: authResult.user,
                    token: authResult.token
                }
            };
        } catch (error: Error | any) {
            return {
                success: false,
                data: null,
                error: error.message || 'An error occurred during login'
            };
        }
    }

    @RWSRoute('home.api-authorize')    
    async authorizeAPI( @Body() body: { apikey: string }): Promise<IUserLoginApiResponse>
    {      
            
            try {                
                const user: IUser = await User.findOneBy({conditions: { apiKeys: {
                    some: {
                        id: body.apikey
                    }
                } }});

                if(!user){
                    return {
                        success: false,
                        data: null,
                        error: 'Wrong API key'
                    };
                }

                const token = this.authService.generateToken(user);
    
                return {
                    success: true,
                    data: {
                        user: user,
                        token: token
                    }
                };
            } catch (error: Error | any) {
                return {
                    success: false,
                    data: null,
                    error: error.message || 'An error occurred during login'
                };
            }
    }   
    
    @RWSRoute('home.check')    
    async authCheck( @Body() body: { token: string }): Promise<IUserLoginApiResponse>
    {      
            
            try {
                if (!body.token) {
                    return {
                        success: false,
                        data: null,
                        error: 'Token is required'
                    };
                }
        
                const authResult = await this.authService.verifyToken(body.token);
                
                if (!authResult) {
                    return {
                        success: false,
                        data: null,
                        error: 'Invalid credentials'
                    };
                }

                const user: IUser = await this.authService.getUserFromToken(body.token);
    
                return {
                    success: true,
                    data: {
                        user: user,
                        token: body.token
                    }
                };
            } catch (error: Error | any) {
                return {
                    success: false,
                    data: null,
                    error: error.message || 'An error occurred during login'
                };
            }
    }    
}
