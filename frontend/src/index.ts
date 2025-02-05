import RWSClient, { RWSContainer, RWSPlugin } from '@rws-framework/client';
import { RWSBrowserRouter, BrowserRouterOpts  } from '@rws-framework/browser-router';
import { RWSWebsocketsPlugin, WSOptions  } from '@rws-framework/nest-interconnectors';
import backendRoutes from '../../backend/src/routing/routes';
import initComponents from './application/_initComponents';
import './styles/main.scss';


import '@shoelace-style/shoelace/dist/shoelace.js';


import routes from './routing/routes';
import notifierMethod from './_notifier';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path';

async function initializeApp() {
    const theClient = RWSContainer().get(RWSClient);
    
    

    theClient.setNotifier(notifierMethod);
    theClient.addPlugin<BrowserRouterOpts>(RWSBrowserRouter);
    theClient.addPlugin<WSOptions>(RWSWebsocketsPlugin);

    theClient.assignClientToBrowser();             

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
