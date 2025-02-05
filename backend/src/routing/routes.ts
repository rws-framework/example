import {  IPrefixedHTTProutes } from '@rws-framework/server/src/routing/routes';
import { homeRoutes } from './actions/homeActions';
import { userRoutes } from './actions/userActions';


export default [
    {
        prefix: '/api',
        controllerName: 'home',
        routes: homeRoutes
    },
    {
        prefix: '/api/users',
        controllerName: 'user',
        routes: userRoutes
    }
] as IPrefixedHTTProutes[];
