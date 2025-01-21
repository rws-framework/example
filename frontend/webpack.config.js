const path = require('path');
const dotenv = require('dotenv');

const RWSWebpackWrapper  = require('@rws-framework/client/rws.webpack.config');
const executionDir = process.cwd();

const envPath = path.resolve(__dirname, '..', '.env');

let envVars = dotenv.config({
  path: envPath
}).parsed;

const devMode = parseInt(process.env.DEV) === 1;

module.exports = RWSWebpackWrapper({
  dev: devMode,
  hot: false,
  report: false,
  tsConfigPath: executionDir + '/tsconfig.json',
  entry: `${executionDir}/src/index.ts`,
  executionDir: executionDir,
  publicDir:  path.resolve(executionDir, 'public'),
  outputDir:  path.resolve(executionDir, 'public', 'js'),
  outputFileName: 'rws.client.js',
  parted: false,
  partedDirUrlPrefix: '/js',
  copyAssets: {
    './public/css/' : [      
      './src/styles/compiled/main.css'
    ],
  },
  rwsDefines: {
    DOMAIN: envVars.DOMAIN, 
    WS_URL: envVars.WS_URL, 
    BACKEND_URL: envVars.BACKEND_URL,
  }
});