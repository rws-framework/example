import { IHTTProute } from "@rws-framework/server/src/routing/routes";

export const deepgramRoutes: IHTTProute[] = [                
    {
        name: 'deepgram.index',
        path: '/',  
        method: 'GET'                
    },
    {
        name: 'deepgram.list',
        path: '/list',  
        method: 'GET'                
    },
    {
        name: 'deepgram.delete',
        path: '/delete/:id',  
        method: 'GET'                
    },
    {
        name: 'deepgram.process',
        path: '/process',  
        method: 'POST'                
    }                         
];            
