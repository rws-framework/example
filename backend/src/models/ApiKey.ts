import { RWSannotations, RWSModel } from '@rws-framework/server';

import 'reflect-metadata';
import User from './User';
import IApiKey from './interfaces/IApiKey';
const { RWSTrackType, Relation } = RWSannotations.modelAnnotations;

class ApiKey extends RWSModel<ApiKey> implements IApiKey {
    static _RELATIONS = {
        user: true,
    };

    @Relation(() => User, true)
    user: User;

    @RWSTrackType(Object)
    keyval: string;

    @RWSTrackType(Date, { required: true })
    created_at: Date;
  
    @RWSTrackType(Date)
    updated_at: Date;

    static _collection = 'api_keys';

    constructor(data?: IApiKey) {   
        super(data);    

        if(!this.created_at){
            this.created_at = new Date();
        }    

        this.updated_at = new Date();
    }    
}

export default ApiKey;