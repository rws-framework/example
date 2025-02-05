import { IManagerConfig } from '@rws-framework/manager';

import dotenv from 'dotenv';
import url from 'url';
import path from 'path';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = dotenv.config({ path: path.join(__dirname, '.env') }).parsed;

export default function config(): IManagerConfig
{
    return {
        dev: true,
        build: {
            front: {
                workspaceDir: './frontend',
                outputDir: './public/js',
                publicDir: './public',
                env: {
                    DOMAIN: env?.DOMAIN,
                    BACKEND_URL: env?.BACKEND_URL,
                    WS_URL: env?.WS_URL
                }                                          
            },
            back: {
                workspaceDir: './backend',
                outputFileName: 'rws.server.js',
                publicDir: '../frontend/public',
                externalRoutesFile: './src/routing/routes.ts'
            },
            cli: {
                entrypoint: './src/cli.ts',
                workspaceDir: './backend',
                outputFileName: 'cli.server.js'
            }
        }
    }
};