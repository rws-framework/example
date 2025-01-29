import { defineConfig, ConfigEnv, UserConfig } from 'vite';
import { rwsViteBuilder } from '@rws-framework/client/builder/vite';
import fs from 'fs';

import path from 'path';

function logError(error: any) {
  console.error('Vite config error:', {
    message: error.message,
    stack: error.stack,
    cause: error.cause
  });
  throw error;
}

export default async (configEnv: ConfigEnv) => {


  try {  
    const rwsBuild: UserConfig = rwsViteBuilder({
      dev: true,
      entry: path.resolve(__dirname, 'src', 'index.ts'),
      outDir: path.resolve(__dirname, 'public', 'js'),
      cssOutputPath: path.resolve(__dirname, 'public', 'css'),
      defines: {
  
      }
    });

    return defineConfig(rwsBuild);
  } catch (error) {
    logError(error);
    throw error;
  }
};