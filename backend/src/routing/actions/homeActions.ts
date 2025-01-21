import { IHTTProute } from "@rws-framework/server/src/routing/routes";

export const homeRoutes: IHTTProute[] = [   
    {
        name: 'home.login',
        path: '/login',
        method: 'POST'                
    },
    {
        name: 'home.check',
        path: '/check',
        method: 'POST'                
    },
    {
        name: 'home.api-authorize',
        path: '/authorize',
        method: 'POST'                
    }
]         
