import { RWSannotations, RWSModel } from '@rws-framework/server';

import IUser from './interfaces/IUser';
import 'reflect-metadata';

import ApiKey from './ApiKey';
import IApiKey from './interfaces/IApiKey';
const { RWSTrackType, InverseRelation } = RWSannotations.modelAnnotations;

class User extends RWSModel<User> implements IUser {
    @RWSTrackType(String)
    username: string;

    @RWSTrackType(String)
    passwd: string;

    @RWSTrackType(Boolean)
    active: boolean;

    @RWSTrackType(Date, { required: true })
    created_at: Date;
  
    @RWSTrackType(Date)
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