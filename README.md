# RWS Fullstack implementation example project

## Table of Contents
- [Environment](#environment)
- [Config](#config)
  - [App Configuration](#config)
  - [Nest App Module](#nest-app-module-for-rws-wrapper)
- [Docker Work](#docker-work)
  - [Building Docker](#building-docker)
  - [Running Docker](#running-docker)
- [Models](#models)
  - [Models Index File](#models-index-file)
  - [Example User Model](#example-user-model)
  - [Relations](#relations)
    - [Basic Many to One Relation](#relations)
    - [Relation Decorator](#relation-decorator-many-to-one)
    - [Inverse Relation Decorator](#inverse-relation-decorator-one-to-many)
  - [RWS Model to Prisma Conversion](#rws-model-to-prisma-conversion)
- [CLI](#cli)
  - [Init](#init)
  - [Custom Command](#custom-command)
- [Frontend](#frontend)
- [Warning](#warning)

## Environment

First prepare .env file in root dir from:

```
.env.dist
```

Go to **/docker**

**setup .env for /docker**

Best to link with main .env - env keys are same in app and for docker.

```bash
ln -s ../.env
```

**setup docker network**

For precise networking (useful with more projects and X APIs under one docker-compose).

***sorry i use it as standard so it's here - deal with it***

```bash
docker network create main
```

## Config

in ```src/config/config.ts`` setup:

```typescript
import IAppConfig from "@rws-framework/server/src/types/IAppConfig";
import { ConfigHelper } from "./ConfigHelper";
import httpRoutes from '../routing/routes';
import { resources } from '../app/resources';
import { models } from '../models';

export interface IAppModuleOpts extends IAppConfig { 
 jwt_expiration_days: number
}

const configHelper = new ConfigHelper(); // This is basically .env reader - it's in repo.

function config(): IAppModuleOpts
{
    return {        
        resources,
        features: {
            routing_enabled: true,
            ws_enabled: true,
            ssl: false,
            auth: false
        },
        user_class: null,
        user_models: models, //models index export
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
        ws_routes: {        
        },
        http_routes: httpRoutes,
    };
}


export { config };
```

**Nest app module for RWS wrapper**

The RWS wrapper gets the module from config ***module*** field.

```typescript
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
        ConfigService,
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
```

## Docker work

### Building docker

```
docker-compose up -d
```

### Running docker

***After install***

Run to start dev server

```
./run.sh dev
```

Or build and run:

```
./run.sh build
```
and
```
./run.sh server
```

**Frontend alias has watch/build commands**

```
./front.sh watch
```

# Models

## Models index file

```typescript
import ApiKey from "./ApiKey";
import User from "./User";

export const models = [ User, ApiKey];
```


## Example user model

```typescript
    import { RWSannotations, RWSModel } from '@rws-framework/server';

import IUser from './interfaces/IUser';
import 'reflect-metadata';

import ApiKey from './ApiKey';
import IApiKey from './interfaces/IApiKey';
const { RWSTrackType, InverseRelation } = RWSannotations.modelAnnotations;

class User extends RWSModel<User> implements IUser {
    @RWSTrackType(String)
    username: string;

    @RWSTrackType(String) // Can also handle Object and Number
    passwd: string;

    @RWSTrackType(Boolean)
    active: boolean;

    @RWSTrackType(Date, { required: true })
    created_at: Date;
  
    @RWSTrackType(Date)
    updated_at: Date;

    @InverseRelation(() => ApiKey, () => User) //Every relation and inverse relation decorator uses arrow function model passing
    apiKeys: IApiKey[];

    static _collection = 'user';

    static _RELATIONS = {
        transcriptions: true,
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

//Must export default for automated DI / build work.
export default User;
```

## Relations

***Basic many to one relation***
```typescript
import { RWSannotations, RWSModel } from '@rws-framework/server';

import 'reflect-metadata';
import User from './User';
import IApiKey from './interfaces/IApiKey';
const { RWSTrackType, Relation } = RWSannotations.modelAnnotations;

class ApiKey extends RWSModel<ApiKey> implements IApiKey {
    static _RELATIONS = {
        user: true,
    };

    @Relation(() => User, true) // second attribute is required = false
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
```

***Relation decorator*** (many-to-one)

```typescript
import 'reflect-metadata';
import Model, { OpModelType } from '../_model';

interface IRelationOpts {
    required?: boolean
    key?: string
    relationField?: string
    relatedToField?: string
    relatedTo: OpModelType<Model<any>>
}
  
function Relation(theModel: () => OpModelType<Model<any>>, required: boolean = false, relationField: string = null, relatedToField: string = 'id') {
    return function(target: any, key: string) {     
        // Store the promise in metadata immediately
        const metadataPromise = Promise.resolve().then(() => {
            const relatedTo = theModel();
            const metaOpts: IRelationOpts = {required, relatedTo, relatedToField};                    
            if(!relationField){
                metaOpts.relationField = relatedTo._collection + '_id';
            } else{
                metaOpts.relationField = relationField;
            }  
            metaOpts.key = key;
            return metaOpts;
        });

        // Store both the promise and the key information
        Reflect.defineMetadata(`Relation:${key}`, {
            promise: metadataPromise,
            key
        }, target);
    };
}


export default Relation;
export {IRelationOpts};
```

***Inverse relation decorator*** (one-to-many)
```typescript
import 'reflect-metadata';
import Model, { OpModelType } from '../_model';

interface InverseRelationOpts{
    key: string,
    inversionModel: OpModelType<Model<any>>,
    foreignKey: string    
  }

  function InverseRelation(inversionModel: () => OpModelType<Model<any>>, sourceModel: () => OpModelType<Model<any>>, foreignKey: string = null) {    
    return function(target: any, key: string) {     
        // Store the promise in metadata immediately
        const metadataPromise = Promise.resolve().then(() => {
            const model = inversionModel();
            const source = sourceModel();
    
            const metaOpts: InverseRelationOpts = {
                key,
                inversionModel: model,
                foreignKey: foreignKey ? foreignKey : `${source._collection}_id`
            };             
    
            return metaOpts;
        });

        // Store both the promise and the key information
        Reflect.defineMetadata(`InverseRelation:${key}`, {
            promise: metadataPromise,
            key
        }, target);
    };
}

export default InverseRelation;
export {InverseRelationOpts};
```


## RWS Model to prisma conversion

Code for RWS to prisma conversion from "@rws-framework/server" package:

```typescript
async function generateModelSections<T extends Model<T>>(model: OpModelType<T>): Promise<string> {
    let section = '';
    const modelMetadatas: Record<string, {annotationType: string, metadata: any}> = await Model.getModelAnnotations(model);    

    const modelName: string = (model as any)._collection;
    
    section += `model ${modelName} {\n`;
    section += '\tid String @map("_id") @id @default(auto()) @db.ObjectId\n';
 
    for (const key in modelMetadatas) {
        const modelMetadata: IMetaOpts = modelMetadatas[key].metadata;            
        const requiredString = modelMetadata.required ? '' : '?';  
        const annotationType: string = modelMetadatas[key].annotationType;

        if(key === 'id'){
            continue;
        }
        
        if(annotationType === 'Relation'){
            const relatedModel = modelMetadata.relatedTo as OpModelType<T>;        
            // Handle direct relation (many-to-one or one-to-one)
            section += `\t${key} ${relatedModel._collection}${requiredString} @relation("${modelName}_${relatedModel._collection}", fields: [${modelMetadata.relationField}], references: [${modelMetadata.relatedToField}], onDelete: Cascade)\n`;      
            section += `\t${modelMetadata.relationField} String${requiredString} @db.ObjectId\n`;
        } else if (annotationType === 'InverseRelation'){        
            // Handle inverse relation (one-to-many or one-to-one)
            section += `\t${key} ${modelMetadata.inversionModel._collection}[] @relation("${modelMetadata.inversionModel._collection}_${modelName}")\n`;
        } else if (annotationType === 'InverseTimeSeries'){        
            section += `\t${key} String[] @db.ObjectId\n`;      
        } else if (annotationType === 'TrackType'){        
            const tags: string[] = modelMetadata.tags.map((item: string) => '@' + item);          
            section += `\t${key} ${toConfigCase(modelMetadata)}${requiredString} ${tags.join(' ')}\n`;
        }
    }
    
    section += '}\n';
    return section;
}

function toConfigCase(modelType: any): string {
    const type = modelType.type;
    const input = type.name;  

    if(input == 'Number'){
        return 'Int';
    }

    if(input == 'Object'){
        return 'Json';
    }

    if(input == 'Date'){
        return 'DateTime';
    }


    const firstChar = input.charAt(0).toUpperCase();
    const restOfString = input.slice(1);
    return firstChar + restOfString;
}
```

# CLI


## Init
Basic CLI command that executes **generateModelSections()** from conversion script is 

```bash
yarn rws init
```

it initiats prisma models set in config ***user_models*** field

## Custom command

Add RWSCommand decorator for command "rws admin-add login password"

```typescript
import 'reflect-metadata';

import chalk from 'chalk';

import { Injectable } from '@nestjs/common';
import { DBService, ProcessService } from '@rws-framework/server';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/AuthService';
import { ConsoleService, UtilsService } from '@rws-framework/server';
import { RWSBaseCommand, RWSCommand } from '@rws-framework/server/src/commands/_command';
import { ParsedOptions } from '@rws-framework/server/exec/src/application/cli.module';

import User from '../models/User';

@Injectable()
@RWSCommand({name: 'admin-add', description: 'Systems init command.'})
export class AdminStartCommand extends RWSBaseCommand {
  constructor(
    protected readonly utilsService: UtilsService,
    protected readonly consoleService: ConsoleService,
    protected readonly configService: ConfigService,
    protected readonly processService: ProcessService,          
    protected readonly dbService: DBService,
    protected readonly authService: AuthService,
  ) {    
    super(utilsService, consoleService, configService, processService, dbService);    
  }    

  async run(
    passedParams: string[],
    options: ParsedOptions
  ): Promise<void> {
    const [login, pass] = passedParams;
    this.consoleService.log(this.consoleService.color().green(`[RWS] adding admin (${login}/${pass})... `));    

    const exUser: User = await User.findOneBy({ conditions: { username: login } });
    
    if(exUser){
      console.log(chalk.yellow(`User ${login} already exists`));
    }

    // (...) rest of code
  }
}
```

this command is executed from /backend directory with 

```bash
yarn rws admin-add login pass
```

## CLI Options interface

options extracted from command (-f --force)

```typescript
export interface ParsedOpt {
  key: string,
  value: string | boolean,
  fullString: string  
}
export interface ParsedOptions {
  [key: string]: ParsedOpt;
}
```

```bash
yarn rws init
```

# Frontend

Frontend is based on webcomponents templating system MS Fast v 1.* (v2 incoming)

https://fast.design/

its started in **frontend/src/index.ts**

```typescript
import RWSClient, { RWSContainer, RWSPlugin } from '@rws-framework/client';
import { RWSBrowserRouter, BrowserRouterOpts  } from '@rws-framework/browser-router';
import { RWSWebsocketsPlugin, WSOptions  } from '@rws-framework/nest-interconnectors';
import backendRoutes from '../../backend/src/routing/routes';
import initComponents from './application/_initComponents';
import './styles/main.scss'; //global styles (over webcomponent scope) and imported vendors styles


import '@shoelace-style/shoelace/dist/shoelace.js'; //some webcomponent widgets

import routes from './routing/routes';
import notifierMethod from './_notifier';
import { setBasePath } from '@shoelace-style/shoelace';

async function initializeApp() {
    const theClient = RWSContainer().get(RWSClient);      

    theClient.setNotifier(notifierMethod);
    theClient.addPlugin<BrowserRouterOpts>(RWSBrowserRouter); //Browser router plugin
    theClient.addPlugin<WSOptions>([RWSWebsocketsPlugin, { // WS client
        enabled: true,
        auto_notify: true
    }]);

    theClient.assignClientToBrowser(); //optional add window.RWS.client = theClient            

    theClient.onInit(async () => {
        RWSPlugin.getPlugin<RWSBrowserRouter>(RWSBrowserRouter).addRoutes(routes);
        initComponents();
    });    

    setBasePath('/css');

    console.log('envs', process.env.BACKEND_URL);

    theClient.start({
        backendRoutes,
        backendUrl: process.env.BACKEND_URL,
        wsUrl: process.env.WS_URL,
        partedDirUrlPrefix: '/js',
        parted: false //unfinished - working but makes big files for now. 
    });
}

initializeApp().catch(console.error);
```

## Templates

**In RWS HTML templates acts the same as HTML-in-JS but all FAST directives start with T.**

@observable and @attr are in

```typescript
  import { observable, attr, externalObservable } from '@rws-framework/client';  
```

@externalObservable is RWS observable object that gets notified on external webcomponent change f.e. from outside RWS JS meddling. It's made to avoid overusing 

```typescript
class ComponentClass{
  @observable xxx; 
  xxxChanged(oldVal: string, newVal: string){
    this.xxx = newVal;
  }
}
```

```HTML
${T.when(x => x.isX, T.html`<div></div>`)}
<ul>${T.repeat(x => x.listX, T.html`<li>${ x => x}</li>`)}</ul>
```

## Component

Components are defined in component-dir/component.ts
Styles must be created in ./styles/layout.scss and html in ./template.html

```typescript
import { RWSViewComponent, RWSView, observable } from '@rws-framework/client';

@RWSView('rws-modal')
class RWSModal extends RWSViewComponent {      
    closeModal: () => void
    connectedCallback(): void {
        super.connectedCallback();        
    }
}

RWSModal.defineComponent();

export { RWSModal };
```

# Warning

### --rebuild in "rws" command will force cache rebuild for CLI client

```bash
### Mongo DB service is run without authorization. DO NOT USE THIS IMAGE FOR PROD OR ANY PUBLIC USAGE!!!
```