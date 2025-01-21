import { RWSService } from '@rws-framework/client';
import { IUser } from '../backendImport';

class StorageService extends RWSService {
    set(key: string, value: string): StorageService 
    {
        localStorage.setItem(key, value);
        return this;
    }

    setUser(user: IUser): StorageService 
    {
        this.set('jwt_user', JSON.stringify(user));
        return this;
    }

    setToken(token: string): StorageService 
    {
        this.set('jwt_token', token);
        return this;
    }

    get(key: string): string | null 
    {
        return localStorage.getItem(key);
    }

    getUser(): IUser | null 
    {
        const item = localStorage.getItem('jwt_user');

        if(!item || item === null || item === ''){
            return null;
        }

        return JSON.parse(item) as IUser;
    }

    getToken(): string | null 
    {
        return localStorage.getItem('jwt_token');
    }


    clear(key: string): StorageService
    {
        localStorage.removeItem(key);
        return this;
    }
    clearUser(): StorageService
    {
        this.clear('jwt_token').clear('jwt_user');

        return this;
    }
}

export default StorageService.getSingleton();
export { StorageService as StorageServiceInstance };