import { IHTTProute } from "@rws-framework/server/src/routing/routes";

export const userRoutes: IHTTProute[] = [                
    {
        name: 'user.index',
        path: '/',  
        method: 'GET'                
    },
    {
        name: 'user.create',
        path: '/create',  
        method: 'POST'                
    },
    {
        name: 'user.createkey',
        path: '/createkey',  
        method: 'GET'                
    },
    {
        name: 'user.deletekey',
        path: '/deletekey/:id',  
        method: 'GET'                
    },
    {
        name: 'user.delete',
        path: '/delete/:id',  
        method: 'GET'                
    }                               
]