import { IManagerConfig } from '@rws-framework/manager';

export default function config(): IManagerConfig
{
    return {
        dev: true,
        build: {
            front: {
                workspaceDir: './frontend',
                outputDir: './public/js',
                publicDir: './public'           
            },
            back: {
                workspaceDir: './backend',
                outputFileName: 'rws.server.js',
                publicDir: '../frontend/public'
            },
            cli: {
                workspaceDir: './backend',
                outputFileName: './build/cli.server.js'
            }
        }
    }
};