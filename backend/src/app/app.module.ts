import { Module } from '@nestjs/common';

import { HomeController } from '../controllers/home.controller';
import { UserController } from '../controllers/user.controller';

import { WSGateway } from '../gateways/WSGateway';

import { UtilsService, RWSFillService } from '@rws-framework/server';
import { AuthService } from '../services/AuthService';
import { ConfigService } from '@nestjs/config';
import { WebsocketManagerService } from '@rws-framework/nest-interconnectors/src/backend/services/WebsocketManagerService';

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { NotFoundExceptionFilter } from '../filters/not-found.filter';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { NestModuleData } from '@rws-framework/server/exec/src/application/cli.module';
import { AdminStartCommand } from '../commands/adminadd.command';


@Module({})
export class TheAppModule {
  static forRoot(parentModule: NestModuleData){
    const processedImports = parentModule ? [parentModule] : [];

    return {
      module: TheAppModule,
      imports: processedImports,
      controllers:[
        HomeController,   
        UserController
      ],
      providers: [
        AuthService, 
        AdminStartCommand,   
        UtilsService,
        RWSFillService,
        WebsocketManagerService,
        WSGateway,
        {
          provide: APP_INTERCEPTOR,
          useClass: SerializeInterceptor,
        },
        {
          provide: APP_FILTER,
          useClass: NotFoundExceptionFilter,
        }
      ],
      exports: [
        WebsocketManagerService
      ]
    }
  }
}
