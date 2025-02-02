import { IManagerConfig } from '@rws-framework/manager';

export default function config(): IManagerConfig
{
    return {
        front: {
            entrypoint: './frontend',
        },
        back: {
            entrypoint: './backend',
            customOutputFile: './build/rws.server.js',            

        },
        cli: {
            entrypoint: './backend',
            customOutputFile: './build/cli.server.js'
        }
    }
};