import { TrackType, InverseRelation, RWSModel } from '@rws-framework/db';

import IUser from './interfaces/IUser';
import 'reflect-metadata';

import ApiKey from './ApiKey';
import IApiKey from './interfaces/IApiKey';

class User extends RWSModel<User> implements IUser {
    @TrackType(String)
    username: string;

    @TrackType(String)
    passwd: string;

    @TrackType(Boolean)
    active: boolean;

    @TrackType(Date, { required: true })
    created_at: Date;
  
    @TrackType(Date)
    updated_at: Date;

    @InverseRelation(() => ApiKey, () => User)
    apiKeys: IApiKey[];

    static _collection = 'user';

    static _RELATIONS = {
        apiKeys: true
    };

    static _CUT_KEYS = ['passwd'];

    constructor(data?: IUser) {   
        super(data);    

        if(!this.created_at){
            this.created_at = new Date();
        }      
    }    

    addMessage(message: string){
        this.messages.push(message);
    }
}

export default User;