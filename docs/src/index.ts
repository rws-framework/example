import { RWSClient, RWSClientInstance, RWSContainer, RWSPlugin } from '@rws-framework/client';
import { RWSBrowserRouter, BrowserRouterOpts } from '@rws-framework/browser-router';
import { declareCmp } from './_components';

import './styles/main.scss';

async function main(){
  const client: RWSClientInstance = RWSContainer().get(RWSClient);

  client.addPlugin<BrowserRouterOpts>(RWSBrowserRouter);

  
  client.assignClientToBrowser();             

  client.onInit(async () => {
       const router: RWSBrowserRouter | null = RWSPlugin.getPlugin<RWSBrowserRouter>(RWSBrowserRouter);

       if(router){
        router.addRoutes(routes);
       }
       
       declareCmp();
  });   

  await client.start({            
    partedDirUrlPrefix: '/assets/js',
    parted: false
  });
}