import IAppConfig from "@rws-framework/server/src/types/IAppConfig";
import { ConfigHelper } from "./ConfigHelper";
import httpRoutes from '../routing/routes';

import { models } from '../models';

export interface IAppModuleOpts extends IAppConfig { 
 jwt_expiration_days: number
}

const configHelper = new ConfigHelper();

function config(): IAppModuleOpts
{
    return {       
        resources:[], //@TODO         
        features: {
            routing_enabled: true,
            ws_enabled: true,
            ssl: false,
            auth: false
        },
        
        db_models: models,
        mongo_url: configHelper.get('DATABASE_URL'),
        mongo_db: configHelper.get('MONGODB_DB'),
        port: parseInt(configHelper.get('PORT')) || 3000,        
        ws_port: parseInt(configHelper.get('WS_PORT')) || 3001,        
        pub_dir: configHelper.get('PUBLIC_DIR'),
        domain: configHelper.get('DOMAIN'),
        cors_domain: '*',
        secret_key: configHelper.get('JWT_SECRET'),    
        jwt_expiration_days: parseInt(configHelper.get('JWT_EXPIRATION_DAYS')),
        ssl_cert: null,
        ssl_key: null,  
        http_routes: httpRoutes,
    };
}


export { config };