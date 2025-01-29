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
  publicDir:  path.resolve(executionDir),
  outputDir:  path.resolve(executionDir, 'assets', 'js'),
  stylesOutputDir:  path.resolve(executionDir, 'assets', 'css'),
  outputFileName: 'rws.docs.js',
  parted: false,
  partedDirUrlPrefix: '/assets/js',  
});